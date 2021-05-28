import { getMax } from './numeric-helpers';

// Calculations in this file assume 'Calibri 11'

/* eslint-disable quote-props */
const CHAR_WIDTHS_IN_PX: { [key: string]: number } = {
	// 'a': 1, // 1 is the default and can be omitted
	'b': 8 / 7,
	'c': 6 / 7,
	'd': 8 / 7,
	'e': 8 / 7,
	'f': 5 / 7,
	// 'g': 1, // 1 is the default and can be omitted
	'h': 8 / 7,
	'i': 4 / 7,
	'j': 4 / 7,
	// 'k': 1, // 1 is the default and can be omitted
	'l': 4 / 7,
	'm': 12 / 7,
	'n': 8 / 7,
	'o': 8 / 7,
	'p': 8 / 7,
	'q': 8 / 7,
	'r': 5 / 7,
	's': 6 / 7,
	't': 5 / 7,
	'u': 8 / 7,
	// 'v': 1, // 1 is the default and can be omitted
	'w': 11 / 7,
	// 'x': 1, // 1 is the default and can be omitted
	// 'y': 1, // 1 is the default and can be omitted
	'z': 6 / 7,
	'A': 9 / 7,
	'B': 8 / 7,
	'C': 8 / 7,
	'D': 9 / 7,
	// 'E': 1, // 1 is the default and can be omitted
	// 'F': 1, // 1 is the default and can be omitted
	'G': 9 / 7,
	'H': 9 / 7,
	'I': 4 / 7,
	'J': 5 / 7,
	'K': 8 / 7,
	'L': 6 / 7,
	'M': 12 / 7,
	'N': 10 / 7,
	'O': 10 / 7,
	'P': 8 / 7,
	'Q': 10 / 7,
	'R': 8 / 7,
	// 'S': 1, // 1 is the default and can be omitted
	// 'T': 1, // 1 is the default and can be omitted
	'U': 9 / 7,
	'V': 9 / 7,
	'W': 13 / 7,
	'X': 8 / 7,
	// 'Y': 1, // 1 is the default and can be omitted
	// 'Z': 1, // 1 is the default and can be omitted
	// '0': 1, // 1 is the default and can be omitted
	// '1': 1, // 1 is the default and can be omitted
	// '2': 1, // 1 is the default and can be omitted
	// '3': 1, // 1 is the default and can be omitted
	// '4': 1, // 1 is the default and can be omitted
	// '5': 1, // 1 is the default and can be omitted
	// '6': 1, // 1 is the default and can be omitted
	// '7': 1, // 1 is the default and can be omitted
	// '8': 1, // 1 is the default and can be omitted
	// '9': 1, // 1 is the default and can be omitted
	// '_': 1, // 1 is the default and can be omitted
	'-': 5 / 7,
	' ': 3 / 7,
	'\'': 3 / 7,
	'"': 6 / 7,
	'!': 5 / 7,
	'@': 13 / 7,
	// '#': 1, // 1 is the default and can be omitted
	// '$': 1, // 1 is the default and can be omitted
	'%': 11 / 7,
	'&': 10 / 7,
	// '*': 1, // 1 is the default and can be omitted
	'(': 5 / 7,
	')': 5 / 7,
	// '+': 1, // 1 is the default and can be omitted
	// '=': 1, // 1 is the default and can be omitted
	'{': 5 / 7,
	'}': 5 / 7,
	'[': 5 / 7,
	']': 5 / 7,
	// '|': 1, // 1 is the default and can be omitted
	'/': 6 / 7,
	'\\': 6 / 7,
	'.': 4 / 7,
	',': 4 / 7,
	';': 4 / 7,
	':': 4 / 7
};
/* eslint-enable quote-props */

const MAX_CHAR_VISUAL_WIDTH = Math.max(...Object.values(CHAR_WIDTHS_IN_PX));

function getCharVisualWidth(char: string): number {
	return CHAR_WIDTHS_IN_PX[char] ?? 1;
}

function roundCents(number: number): number {
	return Number.parseFloat(number.toFixed(2));
}

export function getLineVisualWidth(line: string): number {
	if (/\r?\n/.test(line)) throw new Error('Line cannot include CR/LF');

	let width = 0;

	for (const char of line) {
		width += getCharVisualWidth(char);
	}

	return roundCents(width);
}

export function getStringVisualWidth(string: string): number {
	return getMax(
		string.split(/\r?\n/).map(line => getLineVisualWidth(line))
	);
}

export function predictAmountOfLineWraps(line: string, maxVisualWidth: number): number {
	if (/\r?\n/.test(line)) throw new Error('Line cannot include CR/LF');

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
