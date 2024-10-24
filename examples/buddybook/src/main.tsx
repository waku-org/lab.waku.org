import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider} from 'connectkit'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { LightNodeProvider } from "@waku/react";
import { config } from './lib/walletConnect.ts'
import { WAKU_NODE_OPTIONS } from './lib/waku.ts'


const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <LightNodeProvider options={WAKU_NODE_OPTIONS}>
            <Router>
              <App />
            </Router>
          </LightNodeProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
