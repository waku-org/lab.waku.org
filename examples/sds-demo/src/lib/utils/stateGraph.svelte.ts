import { type MessageChannelEventObject } from '$lib/sds/stream';
import { MessageChannelEvent } from '@waku/sds';

const lamportTimestamp = $state(0);
let maxLamportTimestamp = $state(0);

export const initializeGrid = (_maxLamportTimestamp: number) => {
	maxLamportTimestamp = _maxLamportTimestamp;
	const rows = maxLamportTimestamp;
	const columns = maxLamportTimestamp;
	return createGrid(rows, columns);
};

export const addItems = (items: Array<MessageChannelEventObject>, _lamportTimestamp?: number) => {
	if (!_lamportTimestamp) {
		_lamportTimestamp = lamportTimestamp;
	}
	grid[_lamportTimestamp] = items;
};

export const createGrid = (
	rows: number,
	columns: number
): Array<Array<MessageChannelEventObject | null>> => {
	return Array(rows)
		.fill(null)
		.map(() => Array(columns).fill(null));
};

type GridItem = {
	lamportTimestamp: number;
	events: Array<MessageChannelEventObject>;
};

const x_start = $state(0);
const x_window = 100;
const x_threshold = 0;
const virtual_grid: Map<number, GridItem> = $state(new Map());
export const actual_grid = $state(createGrid(x_window, 10).map((row, index) => ({lamportTimestamp: index, columns: row})));
export const update_virtual_grid = (event: MessageChannelEventObject) => {
	const lamportTimestamp = getLamportTimestamp(event);
	if (!lamportTimestamp) {
		return;
	}
	const events = virtual_grid.get(lamportTimestamp)?.events || [];
	events.push(event);
	virtual_grid.set(lamportTimestamp, { lamportTimestamp, events });
	if(lamportTimestamp > x_start + x_window - x_threshold) {
		shift_actual_grid(0 ,lamportTimestamp - x_window - x_threshold);
	} else if (x_start <= lamportTimestamp && lamportTimestamp <= x_start + x_window) {
		actual_grid[lamportTimestamp % x_window].columns.push(event);
	}
}
export const shift_actual_grid = (amount: number = 1, _x_start?: number) => {
	if (!_x_start) {
		_x_start = x_start;
	}
	for(let i = _x_start + amount; i < _x_start + x_window + amount; i++) {
		const events = virtual_grid.get(i)?.events || [];
		actual_grid[i % x_window] = {lamportTimestamp: i, columns: events};
	}
}

export const grid = $state(createGrid(50, 10));

const getLamportTimestamp = (event: MessageChannelEventObject) => {
	let lamportTimestamp = null;
	if (
		event.type === MessageChannelEvent.MessageSent ||
		event.type === MessageChannelEvent.MessageReceived ||
		event.type === MessageChannelEvent.SyncSent ||
		event.type === MessageChannelEvent.SyncReceived
	) {
		lamportTimestamp = event.payload.lamportTimestamp;
		if (!lamportTimestamp) {
			return;
		}
	} else {
		lamportTimestamp = longestTimestamp;
	}
	return lamportTimestamp;
}
const messagesPerLamportTimestamp = $state(new Map<number, Array<MessageChannelEventObject>>());
let longestTimestamp = $state(0);
export const recordMessage = (
	message: MessageChannelEventObject,
	_grid?: Array<Array<MessageChannelEventObject | null>>
) => {
	if (!_grid) {
		_grid = grid;
	}
	let lamportTimestamp = null;
	if (
		message.type === MessageChannelEvent.MessageSent ||
		message.type === MessageChannelEvent.MessageReceived ||
		message.type === MessageChannelEvent.SyncSent ||
		message.type === MessageChannelEvent.SyncReceived
	) {
		lamportTimestamp = message.payload.lamportTimestamp;
		if (!lamportTimestamp) {
			return;
		}
	} else {
		lamportTimestamp = longestTimestamp;
	}
	const messages = messagesPerLamportTimestamp.get(lamportTimestamp) || [];
	messages.push(message);
	messagesPerLamportTimestamp.set(lamportTimestamp, messages);
	if (lamportTimestamp > longestTimestamp) {
		longestTimestamp = lamportTimestamp;
	}
	const firstFill = _grid[lamportTimestamp].findIndex((item) => item !== null);
	if (firstFill === -1) {
		_grid[lamportTimestamp][Math.floor(_grid[lamportTimestamp].length / 2)] = message;
	} else {
		const lastFill = _grid[lamportTimestamp].findLastIndex((item) => item !== null);
		if (firstFill > _grid[lamportTimestamp].length - lastFill) {
			_grid[lamportTimestamp][firstFill - 1] = message;
		} else {
			_grid[lamportTimestamp][lastFill + 1] = message;
		}
	}
};
