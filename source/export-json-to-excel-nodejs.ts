import jetpack from 'fs-jetpack';
import type { JsonSheet, ExportJsonToExcelOptions } from './types';
import { jsonToExcel } from './json-to-excel';
import { expandExportJsonToExcelOptions } from './defaults';

export async function exportJsonToExcelNodejs(destinationPath: string, sheets: JsonSheet[], options?: ExportJsonToExcelOptions): Promise<void> {
	const expandedOptions = expandExportJsonToExcelOptions(options);

	const existence = jetpack.exists(destinationPath);

	if (existence === 'dir') {
		throw new Error(`Destination path is a directory: "${destinationPath}"`);
	}

	if (existence === 'other') {
		throw new Error(`Destination path already exists and is not a file: "${destinationPath}"`);
	}

	if (existence === 'file' && !expandedOptions.overwrite) {
		throw new Error(`Destination file already exists, refusing to overwrite: "${destinationPath}"`);
	}

	const workbook = jsonToExcel(sheets, expandedOptions);

	await expandedOptions.beforeSave(workbook);

	await workbook.xlsx.writeFile(destinationPath);
}
