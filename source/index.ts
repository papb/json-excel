import jetpack = require('fs-jetpack');
import type { JsonSheet, JsonToExcelOptions } from './types';
import { jsonToExcel as _jsonToExcel } from './json-to-excel';
import { expandJsonSheet, expandJsonToExcelOptions } from './defaults';

async function jsonToExcel(sheets: JsonSheet[], destinationPath: string, options?: JsonToExcelOptions): Promise<void> {
	const expandedOptions = expandJsonToExcelOptions(options ?? {});

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

	return _jsonToExcel(
		sheets.map(sheet => expandJsonSheet(sheet)),
		destinationPath,
		expandedOptions
	);
}

export = jsonToExcel;
