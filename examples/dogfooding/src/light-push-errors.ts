// Light Push V3 Error Code Mapping
export const LIGHT_PUSH_V3_ERRORS: Record<string, string> = {
  'not_published_to_any_peer': 'Message was not relayed to any peers. This can happen if the remote peer has no relay connections.',
  'rate_limited': 'Message rejected due to rate limiting. Please slow down message sending.',
  'bad_request': 'Invalid message format or parameters.',
  'internal_server_error': 'Remote peer encountered an internal error.',
  'no_peers_available': 'No suitable peers found for relaying the message.',
  'duplicate_message': 'Message already exists in the network.',
  'message_too_large': 'Message exceeds the maximum allowed size.',
  'invalid_topic': 'The pubsub topic or content topic is invalid.',
  'unauthorized': 'Not authorized to publish to this topic.',
  'service_unavailable': 'Light Push service temporarily unavailable.'
};

export function getLightPushErrorMessage(error: string): string {
  return LIGHT_PUSH_V3_ERRORS[error] || `Unknown Light Push error: ${error}`;
}