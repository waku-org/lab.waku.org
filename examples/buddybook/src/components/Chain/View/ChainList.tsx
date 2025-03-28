import React from 'react';
import { Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import { type BlockPayload } from '@/lib/waku';
import SignChain from '@/components/Chain/SignChain';
import { useEnsName } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import QRCode from '@/components/QRCode';
import { Loader2 } from "lucide-react";
import { sortBlocksBySignatures } from '@/lib/waku';

interface ChainListProps {
  chainsData: BlockPayload[];
  onChainUpdate: (newBlock: BlockPayload) => void;
  isLoading: boolean;
}

const ChainList: React.FC<ChainListProps> = ({ chainsData, onChainUpdate, isLoading }) => {
  const handleChainUpdate = (newBlock: BlockPayload) => {
    onChainUpdate(newBlock);
  };

  const renderBlock = (block: BlockPayload, depth: number = 0) => {
    const childBlocks = chainsData.filter(b => b.parentBlockUUID === block.blockUUID);
    const totalSignatures = block.signatures.length + childBlocks.reduce((acc, child) => acc + child.signatures.length, 0);

    const shareUrl = `${window.location.origin}${import.meta.env.BASE_URL}sign/${block.chainUUID ?? block.blockUUID}/${block.blockUUID}`;

    return (
      <li key={`${block.blockUUID}-${depth}`} className="mb-4">
        <div className="flex items-start">
          <div className="mr-4 mt-2">
            {depth > 0 && (
              <div className="w-6 h-6 border-l-2 border-b-2 border-gray-300"></div>
            )}
          </div>
          {depth === 0 ? (
            <Card className="flex-grow">
              <CardHeader>
                <CardTitle>{block.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{block.description}</p>
                <div className="flex flex-col space-y-2 mt-2">
                  <p className="text-sm text-muted-foreground">
                    <SignerName address={block.signatures[0].address} prefix="Created by" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created at: {new Date(block.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Signatures: {totalSignatures}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Block UUID: {block.blockUUID}
                  </p>
                </div>
                <div className="mt-2 space-x-2">
                  <SignChain 
                    block={block} 
                    chainsData={chainsData} 
                    onSuccess={handleChainUpdate} 
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Share</Button>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col gap-4">
                      <DialogHeader>
                        <DialogTitle>Share this Book</DialogTitle>
                        <DialogDescription>
                          Share this book with others to collect their signatures.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex flex-col items-center gap-4">
                        <QRCode 
                          text={shareUrl} 
                          width={180} 
                          height={180}
                          showCopyButton="text"
                          title={block.title}
                          description={`Sign this chain: ${block.title}`}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex-grow">
              <p className="text-sm">
                <SignerName address={block.signatures[0].address} prefix="Signed by" />
              </p>
            </div>
          )}
        </div>
        {childBlocks.length > 0 && (
          <ul className="ml-8 mt-2">
            {childBlocks.map((childBlock) => renderBlock(childBlock, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  const rootBlocks = chainsData.filter(block => !block.parentBlockUUID);
  const sortedRootBlocks = sortBlocksBySignatures(rootBlocks, chainsData);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          Existing Books
          {isLoading && (
            <span className="ml-2 inline-flex items-center text-muted-foreground text-sm font-normal">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading more books...
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rootBlocks.length === 0 && !isLoading ? (
          <p>No books found.</p>
        ) : (
          <ul className="space-y-4">
            {sortedRootBlocks.map((block) => renderBlock(block, 0))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

const SignerName: React.FC<{ address: `0x${string}`; prefix?: string }> = ({ address, prefix }) => {
  const { data: ensName } = useEnsName({ address })
  
  return (
    <span className="text-sm">
      {prefix && `${prefix}: `}{ensName || `${address.slice(0, 6)}...${address.slice(-4)}`}
    </span>
  );
};

export default ChainList;
