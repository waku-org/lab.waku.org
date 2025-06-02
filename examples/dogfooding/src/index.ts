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
  addMessageToLog,
  renderMessages,
  getSearchTerm,
} from "./ui-manager";

const NUM_MESSAGES_PER_BATCH = 5;
let batchCounter = 0;

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
          } else {
            console.warn(`Failed to send message ${i + 1} (ID: ${chatMessage.id}):`, result.failures);
          }
        } catch (error) {
          console.error(`Error sending message ${i + 1} (ID: ${chatMessage.id}):`, error);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      console.log("Message batch sending complete.");
    };

    const subscribeToMessages = async () => {
      const decoder = createWakuDecoder();
      console.log("Subscribing to messages...");
      await node.nextFilter.subscribe(decoder, (wakuMessage: DecodedMessage) => { 
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
