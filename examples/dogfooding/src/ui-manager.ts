import { ChatMessage } from "./message-service";
import { getNodeCreationTime } from "./waku-service";
import Chart from "chart.js/auto";
// @ts-ignore - plugin has no types in our env
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin as any);

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

const currentMessages: ChatMessage[] = [];
let currentPeerId: string | undefined;

const discoveryChartEl = document.getElementById("discoveryChart") as HTMLCanvasElement | null;
const connectionsChartEl = document.getElementById("connectionsChart") as HTMLCanvasElement | null;
const latencyChartEl = document.getElementById("latencyChart") as HTMLCanvasElement | null;

let discoveryChart: Chart | null = null;
let connectionsChart: Chart | null = null;
let latencyChart: Chart | null = null;

const discoveryTableBody = document.querySelector("#discoveryTable tbody") as HTMLTableSectionElement | null;
const connectionsTableBody = document.querySelector("#connectionsTable tbody") as HTMLTableSectionElement | null;
const latencyTableBody = document.querySelector("#latencyTable tbody") as HTMLTableSectionElement | null;
const latencySummaryTopEl = document.getElementById("latencySummaryTop") as HTMLDivElement | null;
const ttfcSummaryEl = document.getElementById("ttfcSummary") as HTMLDivElement | null;
const discoverySummaryTopEl = document.getElementById("discoverySummaryTop") as HTMLDivElement | null;

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

function toRelTime(ms: number) {
    const start = getNodeCreationTime();
    return (ms - start) / 1000;
}

export function setupCollapsibles() {
    const pairs: Array<[string, string]> = [
        ["toggleLog", "messageLogContainer"],
        ["toggleDiscoveryTable", "discoveryTableContainer"],
        ["toggleConnectionsTable", "connectionsTableContainer"],
        ["toggleLatencyTable", "latencyTableContainer"],
    ];
    pairs.forEach(([headerId, containerId]) => {
        const header = document.getElementById(headerId);
        const container = document.getElementById(containerId);
        const btn = header?.querySelector("button");
        if (!header || !container || !btn) return;
        btn.addEventListener("click", () => {
            const hidden = container.classList.toggle("hidden");
            btn.textContent = hidden ? "Show" : "Hide";
        });
    });
}

export function initCharts() {
    if (discoveryChartEl) {
        discoveryChart = new Chart(discoveryChartEl, {
            type: "line",
            data: {
                datasets: [
                    { label: "bootstrap", data: [], borderColor: "#1abc9c", tension: 0.2, pointRadius: 2, borderWidth: 2 },
                    { label: "peer-exchange", data: [], borderColor: "#e67e22", tension: 0.2, pointRadius: 2, borderWidth: 2 },
                    { label: "peer-cache", data: [], borderColor: "#9b59b6", tension: 0.2, pointRadius: 2, borderWidth: 2 },
                ],
            },
            options: { scales: { x: { type: 'linear', title: { display: true, text: "time (s)" } }, y: { title: { display: true, text: "peers" } } } },
        });
    }
    if (connectionsChartEl) {
        connectionsChart = new Chart(connectionsChartEl, {
            type: "line",
            data: { datasets: [{ label: "connections", data: [], borderColor: "#2980b9", tension: 0.25, pointRadius: 2, borderWidth: 2 }] },
            options: {
                scales: { x: { type: 'linear', title: { display: true, text: "time (s)" } }, y: { title: { display: true, text: "peers" } } },
                plugins: {
                    zoom: {
                        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
                        pan: { enabled: true, mode: 'x' }
                    }
                }
            },
        });
    }
    if (latencyChartEl) {
        latencyChart = new Chart(latencyChartEl, {
            type: "bar",
            data: { labels: [], datasets: [{ label: "latency (ms)", data: [], backgroundColor: "#34495e" }] },
            options: { scales: { x: { type: 'category', title: { display: true, text: "message" } }, y: { title: { display: true, text: "ms" } } } },
        });
    }
}

export function onDiscoveryUpdate(timeline: Array<{ time: number; type: string; total: number }>) {
    if (!discoveryChart || !discoveryTableBody) return;
    const grouped: Record<string, Array<{ x: number; y: number }>> = {};
    discoveryChart.data.datasets?.forEach(ds => { grouped[ds.label as string] = []; });
    timeline.forEach(ev => {
        if (!grouped[ev.type]) grouped[ev.type] = [];
        grouped[ev.type].push({ x: toRelTime(ev.time), y: ev.total });
    });
    discoveryChart.data.datasets?.forEach(ds => {
        const label = ds.label as string;
        // @ts-ignore
        ds.data = grouped[label] || [];
    });
    discoveryChart.update();

    if (discoverySummaryTopEl) {
        const firsts: Record<string, number | undefined> = {
            "bootstrap": undefined,
            "peer-exchange": undefined,
            "peer-cache": undefined,
        };
        for (const ev of timeline) {
            if (firsts[ev.type] === undefined) firsts[ev.type] = ev.time;
        }
        const fmt = (t?: number) => t !== undefined ? `${toRelTime(t).toFixed(2)}s` : "-";
        discoverySummaryTopEl.textContent = `first bootstrap: ${fmt(firsts["bootstrap"])}, peer-exchange: ${fmt(firsts["peer-exchange"])}, peer-cache: ${fmt(firsts["peer-cache"])}`;
    }

    discoveryTableBody.innerHTML = "";
    timeline.slice(-100).forEach(ev => {
        const tr = document.createElement("tr");
        const tdTime = document.createElement("td");
        tdTime.textContent = new Date(ev.time).toLocaleTimeString();
        const tdType = document.createElement("td");
        tdType.textContent = ev.type;
        const tdTotal = document.createElement("td");
        tdTotal.textContent = String(ev.total);
        tr.appendChild(tdTime); tr.appendChild(tdType); tr.appendChild(tdTotal);
        discoveryTableBody.appendChild(tr);
    });
}

export function onConnectionsUpdate(timeline: Array<{ time: number; total: number }>) {
    if (!connectionsChart || !connectionsTableBody) return;
    const data = timeline.map(ev => ({ x: toRelTime(ev.time), y: ev.total }));
    // @ts-ignore
    connectionsChart.data.datasets[0].data = data;
    connectionsChart.update();

    if (ttfcSummaryEl && timeline.length > 0) {
        const first = timeline[0];
        const seconds = toRelTime(first.time);
        ttfcSummaryEl.textContent = `time to first connection: ${seconds.toFixed(2)}s`;
    }

    connectionsTableBody.innerHTML = "";
    timeline.slice(-100).forEach(ev => {
        const tr = document.createElement("tr");
        const tdTime = document.createElement("td");
        tdTime.textContent = new Date(ev.time).toLocaleTimeString();
        const tdTotal = document.createElement("td");
        tdTotal.textContent = String(ev.total);
        tr.appendChild(tdTime); tr.appendChild(tdTotal);
        connectionsTableBody.appendChild(tr);
    });
}

const sentTimestamps = new Map<string, number>();

export function trackMessageSent(id: string, when: number) {
    sentTimestamps.set(id, when);
}

export function trackMessageReceived(id: string, when: number) {
    const sent = sentTimestamps.get(id);
    if (sent === undefined) return;
    const latency = Math.max(0, when - sent);
    if (latencyChart && latencyTableBody) {
        // push label + numeric value for bar chart
        const label = id.slice(-6);
        latencyChart.data.labels?.push(label);
        // @ts-ignore
        latencyChart.data.datasets[0].data.push(latency);
        latencyChart.update();

        const tr = document.createElement("tr");
        const tdId = document.createElement("td"); tdId.textContent = id;
        const tdSent = document.createElement("td"); tdSent.textContent = new Date(sent).toLocaleTimeString();
        const tdRecv = document.createElement("td"); tdRecv.textContent = new Date(when).toLocaleTimeString();
        const tdLat = document.createElement("td"); tdLat.textContent = String(latency);
        tr.appendChild(tdId); tr.appendChild(tdSent); tr.appendChild(tdRecv); tr.appendChild(tdLat);
        latencyTableBody.appendChild(tr);

        const values: number[] = (latencyChart.data.datasets[0].data as any[]).map((v: any) => Number(v));
        if (latencySummaryTopEl) {
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            const sorted = [...values].sort((a, b) => a - b);
            const p = (q: number) => sorted[Math.floor((q / 100) * (sorted.length - 1))] ?? 0;
            latencySummaryTopEl.textContent = `avg=${avg.toFixed(1)}ms p90=${p(90)}ms p95=${p(95)}ms p99=${p(99)}ms`;
        }
    }
}

// In case a message is received before we recorded its send time (tab reload, etc.)
export function recordLatency(id: string, sent: number, received?: number) {
    const when = received ?? Date.now();
    sentTimestamps.set(id, sent);
    trackMessageReceived(id, when);
}

export function wireUiToggles() {
    setupCollapsibles();
}
