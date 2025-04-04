import { MessageChannel } from '@waku/sds';

const channelId = 'channel-id';

const channel = $state(new MessageChannel(channelId));

export function getChannel() {
	return channel;
}

const channels = $state<Record<string, MessageChannel>>({});

export function getOrCreateChannel(channelId: string) {
	if (channels[channelId]) {
		return channels[channelId];
	}
	channels[channelId] = new MessageChannel(channelId);
	return channels[channelId];
}
