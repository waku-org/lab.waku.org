import type { MatchParams } from "$lib/waku/waku.svelte";

let match = $state<MatchParams | undefined>(undefined);

export function setMatch(params: MatchParams) {
	match = params;
}

export function getMatch() {
	return match;
}
