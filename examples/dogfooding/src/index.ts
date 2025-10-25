import {
  getWakuNode,
  createWakuEncoder,
  createWakuDecoder,
  getPeerId
} from "./waku-service";
import { DecodedMessage } from "@waku/sdk";
import {
  encodeMessage,
  decodeMessage,
  ChatMessage,
  ProtoChatMessage,
} from "./message-service";
import {
  updatePeerIdDisplay,
  incrementSentByMe,
  incrementReceivedMine,
  incrementReceivedOthers,
  incrementFailedToSend,
  addMessageToLog,
  renderMessages,
  getSearchTerm,
  initCharts,
  onDiscoveryUpdate,
  onConnectionsUpdate,
  wireUiToggles,
  trackMessageSent,
  trackMessageReceived,
  recordLatency,
  updateStoreQueryStatus,
  displayStoreQueryResults,
  clearStoreQueryResults,
} from "./ui-manager";

const NUM_MESSAGES_PER_BATCH = 5;
let batchCounter = 0;
let continuousSendingIntervalId: number | null = null;
let isContinuousSending = false;

async function initializeApp() {
  try {
    console.log("Initializing Waku node...");
    const node = await getWakuNode();
    const currentPeerId = getPeerId();
    console.log("Waku node initialized. Peer ID:", currentPeerId);

    if (currentPeerId) {
      updatePeerIdDisplay(currentPeerId);
    }

    const sendMessageBatch = async () => {
      const encoder = createWakuEncoder();
      batchCounter++;
      console.log(`Sending batch C${batchCounter} of ${NUM_MESSAGES_PER_BATCH} messages...`);
      for (let i = 0; i < NUM_MESSAGES_PER_BATCH; i++) {
        const messageContent = `Batch ${batchCounter} - Msg ${i + 1} @ ${new Date().toLocaleTimeString()}`;
        const payload = encodeMessage(messageContent);

        const tempDecodedMessage = ProtoChatMessage.decode(payload);
        const messageId = (tempDecodedMessage as any).id || `temp-id-${Date.now()}`;

        const chatMessage: ChatMessage = {
          id: messageId,
          timestamp: Date.now(),
          senderPeerId: currentPeerId || "unknown",
          content: messageContent
        };

        try {
          const result = await node.lightPush.send(encoder, {
            payload,
            timestamp: new Date(chatMessage.timestamp),
          }, { autoRetry: true });

          if (result.successes.length > 0) {
            console.log(`Message ${i + 1} (ID: ${chatMessage.id}) sent successfully.`);
            incrementSentByMe();
            addMessageToLog(chatMessage, 'sent');
            trackMessageSent(chatMessage.id, chatMessage.timestamp);
          } else {
            console.warn(`Failed to send message ${i + 1} (ID: ${chatMessage.id}):`, result.failures);
            const failureReason = result.failures.length > 0 
              ? String(result.failures[0].error) || 'Unknown error'
              : 'No peers available';
            const failedPeer = result.failures.length > 0 
              ? result.failures[0].peerId?.toString()
              : undefined;
            
            const failedMessage: ChatMessage = {
              ...chatMessage,
              failureInfo: {
                error: failureReason,
                peer: failedPeer
              }
            };
            incrementFailedToSend();
            addMessageToLog(failedMessage, 'failed');
          }
        } catch (error) {
          console.error(`Error sending message ${i + 1} (ID: ${chatMessage.id}):`, error);
          const failedMessage: ChatMessage = {
            ...chatMessage,
            failureInfo: {
              error: String(error) || 'Unknown error'
            }
          };
          incrementFailedToSend();
          addMessageToLog(failedMessage, 'failed');
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      console.log("Message batch sending complete.");
    };

    const startContinuousSending = async () => {
      if (isContinuousSending) return;
      isContinuousSending = true;
      const toggleButton = document.getElementById("toggleContinuousSendButton");
      if (toggleButton) toggleButton.textContent = "Stop Continuous Sending";
      if (toggleButton) toggleButton.classList.replace("btn-success", "btn-danger");

      console.log("Starting continuous message sending...");
      continuousSendingIntervalId = window.setInterval(async () => {
        const encoder = createWakuEncoder();
        const messageContent = `Continuous Send @ ${new Date().toLocaleTimeString()}`;
        const payload = encodeMessage(messageContent);
        const tempDecodedMessage = ProtoChatMessage.decode(payload);
        const messageId = (tempDecodedMessage as any).id || `temp-id-${Date.now()}`;

        const chatMessage: ChatMessage = {
          id: messageId,
          timestamp: Date.now(),
          senderPeerId: getPeerId() || "unknown",
          content: messageContent
        };

        try {
          const result = await node.lightPush.send(encoder, {
            payload,
            timestamp: new Date(chatMessage.timestamp),
          }, { autoRetry: true });

          if (result.successes.length > 0) {
            console.log(`Continuous message (ID: ${chatMessage.id}) sent successfully.`);
            incrementSentByMe();
            addMessageToLog(chatMessage, 'sent');
            trackMessageSent(chatMessage.id, chatMessage.timestamp);
          } else {
            console.warn(`Failed to send continuous message (ID: ${chatMessage.id}):`, result.failures);
          }
        } catch (error) {
          console.error(`Error sending continuous message (ID: ${chatMessage.id}):`, error);
        }
      }, 2000); // Send a message every 2 seconds
    };

    const stopContinuousSending = () => {
      if (!isContinuousSending || continuousSendingIntervalId === null) return;
      isContinuousSending = false;
      const toggleButton = document.getElementById("toggleContinuousSendButton");
      if (toggleButton) toggleButton.textContent = "Start Continuous Sending";
      if (toggleButton) toggleButton.classList.replace("btn-danger", "btn-success");

      console.log("Stopping continuous message sending...");
      clearInterval(continuousSendingIntervalId);
      continuousSendingIntervalId = null;
    };

    const subscribeToMessages = async () => {
      const decoder = createWakuDecoder();

      (window as any)["storeQuery"] = async () => {
        const generator = node.store.queryGenerator([decoder], { timeStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), timeEnd: new Date() });
        try {
          for await (const messages of generator) {
            const m = await Promise.all(messages);
            console.log("DEBUG messages", m);
          }
        } catch (error) {
          console.error("Error querying store:", error);
        }
      };

      console.log("Subscribing to messages...");
      await node.filter.subscribe(decoder, (wakuMessage: DecodedMessage) => { 
        console.log("Raw Waku message received, payload length:", wakuMessage.payload.length);
        const chatMessage = decodeMessage(wakuMessage.payload);

        if (chatMessage) {
          console.log("Decoded chat message:", chatMessage);
          if (chatMessage.senderPeerId === currentPeerId) {
            incrementReceivedMine();
            console.log("Received own message (loopback):", chatMessage.id);
          } else {
            incrementReceivedOthers();
            addMessageToLog(chatMessage, 'received-other');
            console.log("Received message from other peer:", chatMessage.id);
          }
          // Use encoded timestamp when available for more accurate latency
          if (chatMessage.timestamp) {
            recordLatency(chatMessage.id, chatMessage.timestamp, Date.now());
          } else {
            trackMessageReceived(chatMessage.id, Date.now());
          }
        } else {
          console.warn("Could not decode received Waku message. Payload might be malformed or not a ChatMessage.");
        }
      });
      console.log("Subscription active.");
    };

    const queryStoreMessages = async () => {
      const storeMessageCountInput = document.getElementById("storeMessageCount") as HTMLInputElement;
      const messageLimit = storeMessageCountInput ? parseInt(storeMessageCountInput.value, 10) : 5;
      
      if (isNaN(messageLimit) || messageLimit < 1) {
        updateStoreQueryStatus("Please enter a valid number of messages (minimum 1)", true);
        return;
      }

      clearStoreQueryResults();
      updateStoreQueryStatus("Querying store...", false);
      console.log(`Querying store for up to ${messageLimit} messages...`);

      try {
        const decoder = createWakuDecoder();
        const allMessages: ChatMessage[] = [];
        
        console.log("Decoder content topic:", decoder.contentTopic);
        console.log("Decoder pubsub topic:", decoder.pubsubTopic);
        
        // Query for messages from the last hour, using paginationLimit to control result size
        const timeEnd = new Date();
        const timeStart = new Date(Date.now() - 1000 * 60 * 60);
        
        const queryOptions = {
          timeStart,
          timeEnd,
          paginationForward: false, // Start from newest
          paginationLimit: messageLimit, // Limit the number of messages returned
        };

        console.log("Store query options:", queryOptions);
        console.log("Time range:", timeStart.toISOString(), "to", timeEnd.toISOString());

        // Collect messages - stop once we have enough
        await node.store.queryWithOrderedCallback(
          [decoder],
          async (wakuMessage) => {
            // Check if we already have enough messages before processing more
            if (allMessages.length >= messageLimit) {
              console.log(`Already collected ${messageLimit} messages, stopping`);
              return true; // Stop processing
            }
            
            const chatMessage = decodeMessage(wakuMessage.payload);
            if (chatMessage) {
              allMessages.push(chatMessage);
              console.log(`Store found message ${allMessages.length}/${messageLimit}:`, {
                id: chatMessage.id,
                content: chatMessage.content.substring(0, 50),
                timestamp: new Date(chatMessage.timestamp).toISOString(),
                sender: chatMessage.senderPeerId.substring(0, 12)
              });
              
              // Stop if we've reached the limit
              if (allMessages.length >= messageLimit) {
                console.log(`Reached limit of ${messageLimit} messages, stopping`);
                return true; // Stop processing
              }
            } else {
              console.warn("Failed to decode message from store");
            }
            
            return false; // Continue to next message
          },
          queryOptions
        );

        console.log(`Store query completed. Collected ${allMessages.length} messages.`);
        
        if (allMessages.length > 0) {
          // Sort by timestamp descending (newest first)
          // Since we're querying with paginationForward: false, we're getting recent messages,
          // but they may not be in perfect order, so we sort them
          allMessages.sort((a, b) => b.timestamp - a.timestamp);
          
          console.log(`Returning ${allMessages.length} message(s)`);
          console.log("Newest message timestamp:", new Date(allMessages[0].timestamp).toISOString());
          if (allMessages.length > 1) {
            console.log("Oldest returned message timestamp:", new Date(allMessages[allMessages.length - 1].timestamp).toISOString());
          }
          
          updateStoreQueryStatus(`✓ Successfully retrieved ${allMessages.length} message${allMessages.length !== 1 ? 's' : ''} from store`, false);
          displayStoreQueryResults(allMessages);
        } else {
          updateStoreQueryStatus("✓ Query completed successfully, but no messages found in store", false);
          displayStoreQueryResults([]);
        }
      } catch (error) {
        console.error("Error querying store:", error);
        updateStoreQueryStatus(`✗ Error querying store: ${error instanceof Error ? error.message : String(error)}`, true);
      }
    };

    const sendMessageButton = document.getElementById("sendMessageButton");
    if (sendMessageButton) {
      sendMessageButton.addEventListener("click", () => {
        console.log("Send Message Button clicked");
        sendMessageBatch();
      });
    }

    const toggleContinuousSendButton = document.getElementById("toggleContinuousSendButton");
    if (toggleContinuousSendButton) {
      toggleContinuousSendButton.addEventListener("click", () => {
        if (isContinuousSending) {
          stopContinuousSending();
        } else {
          startContinuousSending();
        }
      });
    }

    const searchButton = document.getElementById("searchButton");
    if (searchButton) {
      searchButton.addEventListener("click", () => {
        console.log("Search button clicked");
        renderMessages(getSearchTerm());
      });
    }
    
    const searchInput = document.getElementById("searchInput");
    if(searchInput) {
      searchInput.addEventListener("input", () => { 
        console.log("Search input changed");
        renderMessages(getSearchTerm());
      });
    }

    const queryStoreButton = document.getElementById("queryStoreButton");
    if (queryStoreButton) {
      queryStoreButton.addEventListener("click", () => {
        console.log("Query Store button clicked");
        queryStoreMessages();
      });
    }

    initCharts();
    (window as any).onDiscoveryUpdate = onDiscoveryUpdate;
    (window as any).onConnectionsUpdate = onConnectionsUpdate;
    wireUiToggles();
    await subscribeToMessages();
    
    console.log("Application setup complete. Click 'Send New Message Batch' to send messages.");

  } catch (error) {
    console.error("Critical error during app initialization:", error);
    const peerIdDisplayEl = document.getElementById("peerIdDisplay");
    if(peerIdDisplayEl) peerIdDisplayEl.textContent = "Error connecting to Waku Network.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed. Starting app initialization.");
  initializeApp();
});
