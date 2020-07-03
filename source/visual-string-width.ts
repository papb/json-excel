import { getMax } from './numeric-helpers';
import assert = require('assert');

const MAX_CHAR_VISUAL_WIDTH = 1.75;

function getCharVisualWidth(char: string): number {
	const specials: { [key: string]: number } = {
		' ': 0.4,
		f: 0.7,
		m: 1.75
	};
	const half = ['i', 'j', 'l', '\'', '!'];
	return specials[char] ?? (half.includes(char) ? 0.5 : 1);
}

export function getLineVisualWidth(line: string): number {
	assert.strictEqual(/\r?\n/.test(line), false, 'Line cannot include CR/LF');

	let width = 0;

	for (const char of line) {
		width += getCharVisualWidth(char);
	}

	return width;
}

export function getStringVisualWidth(string: string): number {
	return getMax(
		string.split(/\r?\n/).map(line => getLineVisualWidth(line))
	);
}

export function predictAmountOfLineWraps(line: string, maxVisualWidth: number): number {
	assert.strictEqual(/\r?\n/.test(line), false, 'Line cannot include CR/LF');

	// Heuristic to return 0 faster in several cases
	if (line.length * MAX_CHAR_VISUAL_WIDTH <= maxVisualWidth) {
		return 0;
	}

	let result = 0;

	const firstChar = line[0];
	let currentVisualWidth = getCharVisualWidth(firstChar);

	for (let i = 1; i < line.length; i++) {
		const char = line[i];
		const width = getCharVisualWidth(char);

		if (currentVisualWidth + width > maxVisualWidth) {
			result++;
			currentVisualWidth = width;
		} else {
			currentVisualWidth += width;
		}
	}

	return result;
}
