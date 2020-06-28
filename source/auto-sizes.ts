import { getMax, getSum, clamp } from './numeric-helpers';
import { getStringVisualWidth, predictAmountOfLineWraps } from './visual-string-width';
import type { ExpandedAutoFitCellSizesOptions } from './types';

export function getStringHeight(string: string, maxVisualWidth?: number): number {
	const lines = string.split(/\r?\n/);

	if (!maxVisualWidth) {
		return lines.length;
	}

	return lines.length + getSum(
		lines.map(line => predictAmountOfLineWraps(line, maxVisualWidth))
	);
}

function getMinimalFittingColumnWidth(cellsInColumn: string[]): number {
	return getMax(
		cellsInColumn.map(cell => getStringVisualWidth(cell))
	);
}

function getMinimalFittingRowHeight(cellsInRow: string[], realColumnWidths: number[]): number {
	// Since the actual applied column width may be different from the minimal fitting
	// column width, in a few edge cases the minimal fitting height might be actually
	// greater than 1 + the number of explicit linebreaks in the string, due to auto-applied
	// line wraps in long lines.

	const maxAmountOfLines = getMax(
		cellsInRow.map((cell, index) => getStringHeight(cell, realColumnWidths[index]))
	);

	return 15 * maxAmountOfLines;
}

export type AutoFitSizesResult = {
	columnWidths: number[];
	rowHeights: number[];
};

export function getAutoFitCellSizes(
	data: string[][],
	considerExtraRoomForHeaderFilterArrow: boolean,
	options: ExpandedAutoFitCellSizesOptions
): AutoFitSizesResult {
	const result: AutoFitSizesResult = {
		columnWidths: [],
		rowHeights: []
	};

	const rowCount = data.length;
	const columnCount = data[0].length;

	for (let ci = 0; ci < columnCount; ci++) {
		let width = getMinimalFittingColumnWidth(data.map(row => row[ci]));

		if (considerExtraRoomForHeaderFilterArrow) {
			width = Math.max(width, 4 + getStringVisualWidth(data[0][ci]));
		}

		width += options.horizontalPadding;
		width = clamp(width, options.minWidth, options.maxWidth);

		result.columnWidths.push(width);
	}

	for (let ri = 0; ri < rowCount; ri++) {
		let height = getMinimalFittingRowHeight(data[ri], result.columnWidths);
		height += options.verticalPadding;
		height = clamp(height, options.minHeight, options.maxHeight);

		result.rowHeights.push(height);
	}

	return result;
}
