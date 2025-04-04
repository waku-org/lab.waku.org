import { getMessageId } from '$lib/sds/message';
import { MessageChannelEvent } from '@waku/sds';
import type { MessageChannelEventObject } from '$lib/sds/stream';

export const eventColors: { [key in string]: string } = {
	[MessageChannelEvent.MessageSent]: '#427BF5', // bright blue
	[MessageChannelEvent.MessageDelivered]: '#10B981', // vibrant green
	[MessageChannelEvent.MessageReceived]: '#9966CC', // purple (inspired by image)
	[MessageChannelEvent.MessageAcknowledged]: '#3F8C6F', // deeper green
	[MessageChannelEvent.PartialAcknowledgement]: '#754FB0', // deep purple
	[MessageChannelEvent.MissedMessages]: '#F06060', // coral red (from image)
	[MessageChannelEvent.SyncSent]: '#F59E0B', // warm orange (from image)
	[MessageChannelEvent.SyncReceived]: '#DB8500' // deeper orange
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
