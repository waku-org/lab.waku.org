import { ChatMessage } from "./message-service";

const sentByMeCountEl = document.getElementById("sentByMeCount") as HTMLSpanElement;
const receivedMineCountEl = document.getElementById("receivedMineCount") as HTMLSpanElement;
const receivedOthersCountEl = document.getElementById("receivedOthersCount") as HTMLSpanElement;
const peerIdDisplayEl = document.getElementById("peerIdDisplay") as HTMLSpanElement;
const messageListEl = document.getElementById("messageList") as HTMLDivElement;
const searchInputEl = document.getElementById("searchInput") as HTMLInputElement;
const failedToSendCountEl = document.getElementById("failedToSendCount") as HTMLSpanElement;

let sentByMe = 0;
let receivedMine = 0;
let receivedOthers = 0;
let failedToSend = 0;

let currentMessages: ChatMessage[] = [];
let currentPeerId: string | undefined;

export function updatePeerIdDisplay(peerId: string) {
    currentPeerId = peerId;
    if (peerIdDisplayEl) {
        peerIdDisplayEl.textContent = peerId;
    }
}

export function incrementSentByMe() {
    sentByMe++;
    if (sentByMeCountEl) sentByMeCountEl.textContent = sentByMe.toString();
}

export function incrementReceivedMine() {
    receivedMine++;
    if (receivedMineCountEl) receivedMineCountEl.textContent = receivedMine.toString();
}

export function incrementReceivedOthers() {
    receivedOthers++;
    if (receivedOthersCountEl) receivedOthersCountEl.textContent = receivedOthers.toString();
}

export function incrementFailedToSend() {
    failedToSend++;
    if (failedToSendCountEl) failedToSendCountEl.textContent = failedToSend.toString();
}

export function addMessageToLog(message: ChatMessage, type: 'sent' | 'received-mine' | 'received-other' | 'failed') {
    currentMessages.push(message);
    renderMessages(); 
}

export function renderMessages(filterText?: string) {
    if (!messageListEl) return;

    messageListEl.innerHTML = "";

    const messagesToRender = filterText
        ? currentMessages.filter(msg => {
            const searchTerm = filterText.toLowerCase();
            return (
                msg.content.toLowerCase().includes(searchTerm) ||
                msg.id.toLowerCase().includes(searchTerm) ||
                msg.senderPeerId.toLowerCase().includes(searchTerm)
            );
        })
        : currentMessages;

    messagesToRender.sort((a, b) => a.timestamp - b.timestamp);

    messagesToRender.forEach(message => {
        const item = document.createElement("div");
        item.classList.add("message-item");

        let typeClass = '';
        let senderPrefix = '';

        if (message.failureInfo) {
            typeClass = 'failed';
            senderPrefix = 'Me (Failed)';
            item.style.backgroundColor = '#ffebee';
            item.style.borderLeft = '4px solid #f44336';
        } else if (message.senderPeerId === currentPeerId) {
            typeClass = 'sent';
            senderPrefix = 'Me';
        } else {
            typeClass = 'received-other'; 
            senderPrefix = `Other (${message.senderPeerId.substring(0, 6)}...)`;
        }
        
        item.classList.add(typeClass);

        const idText = document.createElement("p");
        idText.classList.add("message-id");
        idText.textContent = `ID: ${message.id}`;

        const contentP = document.createElement("p");
        contentP.classList.add("content");
        contentP.textContent = message.content;

        const senderInfoP = document.createElement("p");
        senderInfoP.classList.add("sender-info");
        senderInfoP.textContent = `From: ${senderPrefix}`;
        
        const timestampP = document.createElement("p");
        timestampP.classList.add("timestamp");
        timestampP.textContent = new Date(message.timestamp).toLocaleTimeString();

        item.appendChild(idText);
        item.appendChild(senderInfoP);
        item.appendChild(contentP);
        item.appendChild(timestampP);

        // Add failure information if present
        if (message.failureInfo) {
            const failureInfoP = document.createElement("p");
            failureInfoP.classList.add("failure-info");
            failureInfoP.style.color = '#d32f2f';
            failureInfoP.style.fontWeight = 'bold';
            failureInfoP.textContent = `Failed: ${message.failureInfo.error}${message.failureInfo.peer ? ` (Peer: ${message.failureInfo.peer.substring(0, 12)}...)` : ''}`;
            item.appendChild(failureInfoP);
        }

        messageListEl.appendChild(item);
    });
}

export function getSearchTerm(): string {
    return searchInputEl ? searchInputEl.value : "";
}
