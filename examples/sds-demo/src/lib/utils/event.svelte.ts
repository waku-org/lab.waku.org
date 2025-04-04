import { getMessageId } from '$lib/sds/message';
import { MessageChannelEvent } from '@waku/sds';
import type { MessageChannelEventObject } from '$lib/sds/stream';

export const eventColors: { [key in string]: string } = {
	[MessageChannelEvent.MessageSent]: '#3B82F6', // blue
	[MessageChannelEvent.MessageDelivered]: '#10B981', // green
	[MessageChannelEvent.MessageReceived]: '#8B5CF6', // purple
	[MessageChannelEvent.MessageAcknowledged]: '#059669', // dark green
	[MessageChannelEvent.PartialAcknowledgement]: '#6D28D9', // dark purple
	[MessageChannelEvent.MissedMessages]: '#EF4444', // red
	[MessageChannelEvent.SyncSent]: '#F59E0B', // orange
	[MessageChannelEvent.SyncReceived]: '#F59E0B' // dark orange
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
