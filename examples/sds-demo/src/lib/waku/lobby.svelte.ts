import { Effect, Option, pipe, Stream } from 'effect';

// Define the type for state transition events
export interface StateTransitionDetail {
	peerId: string;
	prevState: PeerState;
	newState: PeerState;
	message: LobbyMessage;
}

export type StateTransitionEvent = CustomEvent<StateTransitionDetail>;

// Callback type for state transitions
export type StateTransitionCallback = (event: StateTransitionEvent) => void;

// Events emitted by the lobby
export type LobbyEvents = {
	'state-transition': StateTransitionEvent;
};

export enum LobbyMessageType {
	Ping = 'ping',
	Request = 'request',
	Accept = 'accept',
	Match = 'match'
}

enum LobbyEvent {
	GotPing = 'got_ping',
	GotRequest = 'got_request',
	SentRequest = 'sent_request',
	GotAccept = 'got_accept',
	SentAccept = 'sent_accept',
	GotMatch = 'got_match',
	SentMatch = 'sent_match'
}

export type LobbyMessage = {
	messageType: LobbyMessageType;
	timestamp: Date;
	expiry?: Date;
	from: string;
	to?: string;
};

export enum PeerState {
	None = 'none',
	Found = 'found',
	RequestTo = 'request_to',
	RequestFrom = 'request_from',
	AcceptTo = 'accept_to',
	AcceptFrom = 'accept_from',
	Success = 'success',
	Failure = 'failure'
}

// Create a class that extends EventTarget for native event handling
class LobbyState extends EventTarget {
	// The peer state map
	peerState = $state(new Map<string, { state: PeerState; messages: LobbyMessage[] }>());
	
	// Method to update the state of a peer
	updatePeerState(peerId: string, newState: PeerState, message: LobbyMessage): void {
		const prevState = this.peerState.get(peerId)?.state || PeerState.None;
		const messages = this.peerState.get(peerId)?.messages || [];
		
		// Update the state
		this.peerState.set(peerId, { 
			state: newState, 
			messages: [...messages, message] 
		});
		
		// Create and dispatch the event using native event handling
		const event = new CustomEvent<StateTransitionDetail>('state-transition', {
			detail: {
				peerId,
				prevState,
				newState,
				message
			}
		});
		
		this.dispatchEvent(event);
	}
}

// Create the singleton instance
export const lobbyState = $state(new LobbyState());

// Type helpers to narrow message types
type MessageOfType<T extends LobbyMessageType> = Omit<LobbyMessage, 'messageType'> & {
	messageType: T;
};

// Define transition handlers for each message type and state
// Allow the state machine to define only valid transitions
type TransitionTable = {
	[LE in LobbyEvent]: {
		[PS in PeerState]?: PeerState;
	};
};

// State transition table - defines the next state based on message type and current state
const stateMachine: TransitionTable = {
	[LobbyEvent.GotPing]: {
		[PeerState.None]: PeerState.Found,
		[PeerState.Found]: PeerState.Found,
	},
	[LobbyEvent.SentRequest]: {
		[PeerState.Found]: PeerState.RequestTo,
	},
	[LobbyEvent.GotRequest]: {
		[PeerState.None]: PeerState.RequestFrom,
		[PeerState.Found]: PeerState.RequestFrom,
	},
	[LobbyEvent.SentAccept]: {
		[PeerState.RequestFrom]: PeerState.AcceptTo,
	},
	[LobbyEvent.GotAccept]: {
		[PeerState.RequestTo]: PeerState.AcceptFrom,
	},
	[LobbyEvent.SentMatch]: {
		[PeerState.AcceptFrom]: PeerState.Success,
	},
	[LobbyEvent.GotMatch]: {
		[PeerState.AcceptTo]: PeerState.Success,
	}
};

// Example of a function that uses the type-narrowed message
function processMessage<MT extends LobbyMessageType>(
	message: MessageOfType<MT>,
	currentState: PeerState,
	sent: boolean
): Option.Option<PeerState> {
	// Here we know the exact message type at compile time
	// We can do specific processing based on message type
	let event: LobbyEvent | null = null;
	if (message.messageType === LobbyMessageType.Ping) {
		console.log(`Received ping from ${message.from}`);
		if (sent) {
			throw `Don't track sent pings`;
		}
		event = LobbyEvent.GotPing;
	} else if (
		message.messageType === LobbyMessageType.Request
	) {
		console.log(`Received request from ${message.from} to ${message.to || 'everyone'}`);
		event = sent ? LobbyEvent.SentRequest : LobbyEvent.GotRequest;
	} else if (
		message.messageType === LobbyMessageType.Accept
	) {
		console.log(`Received accept from ${message.from} to ${message.to || 'unknown'}`);
		event = sent ? LobbyEvent.SentAccept : LobbyEvent.GotAccept;
	} else if (message.messageType === LobbyMessageType.Match) {
		console.log(`Received match between peers`);
		event = sent ? LobbyEvent.SentMatch : LobbyEvent.GotMatch;
	}

	// Get next state from transition table
	if (event === null) {
		console.warn(`Invalid message type: ${message.messageType}`);
		return Option.none();
	}
	const nextStateValue = stateMachine[event][currentState];
	if (nextStateValue === undefined) {
		// Handle invalid transitions - throw error or return current state
		console.warn(`Invalid transition: ${event} from ${currentState}`);
		return Option.none();
	}
	return Option.some(nextStateValue);
}

export async function processUpdates(updates: { peerId: string; message: LobbyMessage, sent: boolean }[]) {
	for (const update of updates) {
		const { peerId, message, sent } = update;
		const currentState = lobbyState.peerState.get(peerId)?.state || PeerState.None;
		const result = processMessage(message, currentState, sent);
		Option.match(result, {
			onNone: () =>
				console.warn(
					`Invalid state transition: ${message.messageType} from ${currentState} for peer ${peerId}`
				),
			onSome: (newState) => {
				lobbyState.updatePeerState(peerId, newState, message);
			}
		});
	}
}

// Create a typed stream from the events
export const stateTransitionStream = $state(Stream.map(
	Stream.fromEventListener(lobbyState, 'state-transition', { passive: true }),
	(event: Event) => event as CustomEvent<StateTransitionDetail>
));

export function subscribeToStateTransitionStream<A>(stream: Stream.Stream<CustomEvent<A>>, onEvent: (event: A) => void): () => void {
	const fiber = Effect.runFork(
	  pipe(
		stream,
		Stream.tap((event) => 
		  Effect.sync(() => {
			onEvent(event.detail);
		  })
		),
		Stream.runDrain
	  )
	);
	return () => {
	  Effect.runFork(
		Effect.sync(() => {
		  (fiber as unknown as { interrupt: () => void }).interrupt();
		})
	  );
	};
  }