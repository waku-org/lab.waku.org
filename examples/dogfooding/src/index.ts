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
