import React, { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import ChainCreationForm from './components/Chain/Create/CreationPreview'
import ChainList from './components/Chain/View/ChainList'
import { Button } from "@/components/ui/button"
import { type LightNode } from "@waku/sdk"
import { useWaku } from "@waku/react"
import { Loader2 } from "lucide-react"
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { BlockPayload, getMessagesFromStore, subscribeToFilter } from './lib/waku'
import TelemetryOptIn from './components/TelemetryOptIn';
import TelemetryPage from './components/TelemetryPage';
import SignSharedChain from './components/Chain/SignSharedChain'
import ConnectionStatus from '@/components/ConnectionStatus';

type Status = 'success' | 'in-progress' | 'error';



interface WakuStatus {
  filter: Status;
  store: Status;
}

function App() {
  const [isListening, setIsListening] = useState(false);
  const [chainsData, setChainsData] = useState<BlockPayload[]>([])
  const { isLoading: isWakuLoading, error: wakuError, node } = useWaku();
  // Add this new state
  const [wakuStatus, setWakuStatus] = useState<WakuStatus>({
    filter: 'in-progress',
    store: 'in-progress',
  });

  (global.window as any).waku = node;

  const [telemetryOptIn, setTelemetryOptIn] = useState<boolean | null>(null);
  const [isLoadingChains, setIsLoadingChains] = useState(true);

  useEffect(() => {
    const storedOptIn = localStorage.getItem('telemetryOptIn');
    if (storedOptIn !== null) {
      setTelemetryOptIn(storedOptIn === 'true');
    }
  }, []);

  useEffect(() => {
    if (isWakuLoading || !node || node.libp2p.getConnections().length === 0 || chainsData.length > 0 || isListening)  {
      console.log("not starting message listening");
      console.log({
        isWakuLoading,
        node,
        connections: node?.libp2p.getConnections().length,
        chainsData,
        isListening
      })
      return;
    }
      setIsListening(true);
      console.log("connections", node.libp2p.getConnections().length)
        setTimeout(() => {
          startMessageListening();
        }, 2000);
  }, [node, isWakuLoading, wakuStatus])

  const handleTelemetryOptIn = (optIn: boolean) => {
    setTelemetryOptIn(optIn);
    localStorage.setItem('telemetryOptIn', optIn.toString());
  };

  if (isWakuLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold">BuddyBook</h1>
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Connecting to Waku's decentralized network...</p>
          </div>
        </div>
      </div>
    );
  }

  const startMessageListening = async () => {
    console.log("Starting message listening")
    console.log("connections", node.libp2p.getConnections().length)

    // Add timeout for store query
    const STORE_TIMEOUT = 30000; // 30 seconds
    const storeTimeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Store query timeout')), STORE_TIMEOUT);
    });

    try {
      setWakuStatus(prev => ({ ...prev, store: 'in-progress' }));
      setIsLoadingChains(true);
      const messageGenerator = getMessagesFromStore(node as LightNode);
      
      try {
        // Race between store query and timeout
        await Promise.race([
          (async () => {
            for await (const message of messageGenerator) {
              setChainsData(prevChains => {
                const blockExists = prevChains.some(block => block.blockUUID === message.blockUUID);
                if (blockExists) return prevChains;
                return [...prevChains, message];
              });
            }
          })(),
          storeTimeout
        ]);
        setWakuStatus(prev => ({ ...prev, store: 'success' }));
      } catch (error) {
        console.error("Error processing message:", error);
        setWakuStatus(prev => ({ ...prev, store: 'error' }));
      }
    } catch (error) {
      console.error("Error fetching messages from store:", error);
      setWakuStatus(prev => ({ ...prev, store: 'error' }));
    } finally {
      setIsLoadingChains(false);
    }

    // Add timeout for filter subscription
    const FILTER_TIMEOUT = 15000; // 15 seconds
    try {
      setWakuStatus(prev => ({ ...prev, filter: 'in-progress' }));
      const filterPromise = subscribeToFilter(node as LightNode, (message) => {
        handleChainUpdate(message);
      });

      await Promise.race([
        filterPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Filter subscription timeout')), FILTER_TIMEOUT)
        )
      ]);
      
      setWakuStatus(prev => ({ ...prev, filter: 'success' }));
    } catch (error) {
      console.error("Error subscribing to filter:", error);
      setWakuStatus(prev => ({ ...prev, filter: 'error' }));
    }
  }

  if (wakuError) {
    console.error("Waku error:", wakuError);
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center">
        <p className="text-red-500">Error connecting to Waku network</p>
        <p className="text-sm text-muted-foreground">{wakuError.toString()}</p>
      </div>
    );
  }

  const handleChainUpdate = (newBlock: BlockPayload) => {
    setChainsData(prevChains => {
      // Check if the block already exists
      const blockExists = prevChains.some(block => block.blockUUID === newBlock.blockUUID);
      if (blockExists) {
        return prevChains; // Don't add duplicate blocks
      }
      return [...prevChains, newBlock];
    });
  };

  if (telemetryOptIn === null) {
    return <TelemetryOptIn onOptIn={handleTelemetryOptIn} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header wakuStatus={wakuStatus} />
      <div className="md:hidden">
        <ConnectionStatus filter={wakuStatus.filter} store={wakuStatus.store} />
      </div>
      <main className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="create" element={<ChainCreationForm />} />
          <Route path="view" element={<ChainList chainsData={chainsData} onChainUpdate={handleChainUpdate} isLoading={isLoadingChains} />} />
          <Route 
            path="sign/:chainUUID/:blockUUID"
            element={
              <SignSharedChain 
                chainsData={chainsData} 
                onChainUpdate={handleChainUpdate} 
                isLoading={isLoadingChains}
              />
            } 
          />
          <Route path="telemetry" element={<TelemetryPage />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </main>
    </div>
  )
}

const Home: React.FC = () => (
  <div className="space-y-4 md:space-y-6 p-4 md:p-6">
    <h1 className="text-2xl md:text-4xl font-bold">BuddyBook</h1>
    <div className="w-full max-w-sm mx-auto p-4 md:p-6 bg-card rounded-lg shadow-md">
      <Link to="create">
        <Button className="w-full mb-4">
          Create New Book
        </Button>
      </Link>
      <p className="text-sm md:text-base text-muted-foreground">
        Click the button above to start creating a new book.
      </p>
    </div>
    <p className="text-xs md:text-sm text-muted-foreground text-center">
      Welcome to BuddyBook - Create and share your books!
    </p>
  </div>
)

export default App
