import { MessageChannelEvent } from '@waku/sds';

export const eventColors: { [key in string]: string } = {
	[MessageChannelEvent.MessageSent]: '#3B82F6', // blue
	[MessageChannelEvent.MessageDelivered]: '#10B981', // green
	[MessageChannelEvent.MessageReceived]: '#8B5CF6', // purple
	[MessageChannelEvent.MessageAcknowledged]: '#059669', // dark green
		[MessageChannelEvent.PartialAcknowledgement]: '#6D28D9', // dark purple
		[MessageChannelEvent.MissedMessages]: '#EF4444' // red
	};

	// Event type to display name using index signature
export const eventNames: { [key in string]: string } = {
	[MessageChannelEvent.MessageSent]: 'Sent',
	[MessageChannelEvent.MessageDelivered]: 'Delivered',
	[MessageChannelEvent.MessageReceived]: 'Received',
	[MessageChannelEvent.MessageAcknowledged]: 'Acknowledged',
	[MessageChannelEvent.PartialAcknowledgement]: 'Partially Acknowledged',
	[MessageChannelEvent.MissedMessages]: 'Missed'
	};