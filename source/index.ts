export type { JsonSheet, JsonToExcelOptions, ExportJsonToExcelOptions } from './types';
export { jsonToExcel } from './json-to-excel';

import type { JsonSheet, ExportJsonToExcelOptions } from './types';
import { exportJsonToExcelNodejs } from './export-json-to-excel-nodejs';

/**
 * Export a list of JSON sheets as a XLSX file. Works in Node.js and browsers.
 *
 * @param destinationNameOrPath In Node.js, the path to the output file (example: `'path/to/generated/file.xlsx'`). In browsers, the name of the file to be downloaded (example: `'generatedFile.xlsx'`).
 * @param sheets List of JSON sheets
 * @param options Options
 */
export async function exportJsonToExcel(destinationNameOrPath: string, sheets: JsonSheet[], options?: ExportJsonToExcelOptions): Promise<void> {
	await exportJsonToExcelNodejs(destinationNameOrPath, sheets, options);
}
