import { getMessageId } from '$lib/sds/message';
import { MessageChannelEvent } from '@waku/sds';
import type { MessageChannelEventObject } from '$lib/sds/stream';

export const eventColors: { [key in string]: string } = {
	[MessageChannelEvent.MessageSent]: '#4482CF', // blue similar to LIFO
	[MessageChannelEvent.MessageDelivered]: '#45A676', // green similar to FIFO
	[MessageChannelEvent.MessageReceived]: '#8D6AB3', // purple similar to priority+RED
	[MessageChannelEvent.MessageAcknowledged]: '#2E7B58', // darker green
	[MessageChannelEvent.PartialAcknowledgement]: '#6A4A96', // darker purple
	[MessageChannelEvent.MissedMessages]: '#E05252', // error red
	[MessageChannelEvent.SyncSent]: '#DB8D43', // orange/brown similar to priority
	[MessageChannelEvent.SyncReceived]: '#C47A35' // darker orange/brown
};

// Event type to display name using index signature
export const eventNames: { [key in string]: string } = {
	[MessageChannelEvent.MessageSent]: 'Sent',
	[MessageChannelEvent.MessageDelivered]: 'Delivered',
	[MessageChannelEvent.MessageReceived]: 'Received',
	[MessageChannelEvent.MessageAcknowledged]: 'Acknowledged',
	[MessageChannelEvent.PartialAcknowledgement]: 'Partially Acknowledged',
	[MessageChannelEvent.MissedMessages]: 'Missed',
	[MessageChannelEvent.SyncSent]: 'Sync Sent',
	[MessageChannelEvent.SyncReceived]: 'Sync Received'
};

export const currentIdFilter: { id: string | null } = $state({ id: null });

export const matchesIdFilter = (event: MessageChannelEventObject) => {
	if (currentIdFilter) {
		const id = getMessageId(event);

		// Check direct ID match
		if (id === currentIdFilter.id) {
			return true;
		}

		// Check causal history for ID match
		if (
			(event.type === MessageChannelEvent.MessageSent ||
				event.type === MessageChannelEvent.MessageReceived) &&
			event.payload.causalHistory
		) {
			return event.payload.causalHistory.some(
				(dependency: { messageId: string }) => dependency.messageId === currentIdFilter.id
			);
		}

		return false;
	}
};
