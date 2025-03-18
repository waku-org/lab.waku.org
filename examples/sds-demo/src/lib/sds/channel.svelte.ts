import { MessageChannel } from '@waku/sds';

const channelId = 'channel-id';

const channel = $state(new MessageChannel(channelId));

export function getChannel() {
	return channel;
}