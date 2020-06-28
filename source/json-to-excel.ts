import Excel = require('exceljs');
import type { ExpandedJsonSheet } from './types';
import { assertDimensionsAcceptable } from './assert-dimensions-acceptable';
import { assertValidCellContent } from './assert-valid-cell-content';
import { assertValidSheetNames } from './assert-valid-sheet-names';
import { assertNonemptyStringSquareMatrix } from './check-square-matrix';
import { getAutoFitCellSizes } from './auto-sizes';

const ALIGNMENT_STYLE: Partial<Excel.Alignment> = {
	vertical: 'middle',
	horizontal: 'center',
	wrapText: true
};

export async function jsonToExcel(jsonSheets: ExpandedJsonSheet[], path: string): Promise<void> {
	if (jsonSheets.length === 0) {
		throw new TypeError('Expected non-empty list of json sheets, got empty list');
	}

	assertValidSheetNames(jsonSheets.map(sheet => sheet.sheetName));

	const workbook = new Excel.Workbook();

	let tableCount = 0;

	for (const jsonSheet of jsonSheets) {
		assertNonemptyStringSquareMatrix(jsonSheet.data);
		const rowCount = jsonSheet.data.length;
		const columnCount = jsonSheet.data[0].length;
		assertDimensionsAcceptable(rowCount, columnCount);

		const data = jsonSheet.data.map(row => row.map(cell => {
			cell = cell.replace(/\t/g, ' ');
			/// cell = cell.replace(/_x[0-9a-fA-F]{4}_/g, '_x005f$&').replace(/\r?\n/g, '_x000a_');
			return jsonSheet.autoTrimWhitespace ? cell.trim() : cell;
		}));

		const sheet = workbook.addWorksheet(jsonSheet.sheetName);

		if (jsonSheet.formatAsTable) {
			sheet.addTable({
				name: `Table${++tableCount}`,
				ref: 'A1',
				headerRow: true,
				totalsRow: false,
				style: {
					theme: jsonSheet.tableTheme,
					showRowStripes: true
				},
				columns: data[0].map(name => ({ name, filterButton: true })),
				rows: data.slice(1)
			});
		}

		for (let ri = 0; ri < rowCount; ri++) {
			for (let ci = 0; ci < columnCount; ci++) {
				assertValidCellContent(data[ri][ci]);
				sheet.getCell(ri + 1, ci + 1).value = data[ri][ci];
				sheet.getCell(ri + 1, ci + 1).alignment = ALIGNMENT_STYLE;
			}
		}

		if (jsonSheet.autoFitCellSizes) {
			const sizes = getAutoFitCellSizes(data, jsonSheet.formatAsTable, jsonSheet.autoFitCellSizesOptions);

			for (let ri = 0; ri < rowCount; ri++) {
				sheet.getRow(ri + 1).height = sizes.rowHeights[ri];
			}

			for (let ci = 0; ci < columnCount; ci++) {
				sheet.getColumn(ci + 1).width = sizes.columnWidths[ci];
			}
		}
	}

	await workbook.xlsx.writeFile(path);
}
