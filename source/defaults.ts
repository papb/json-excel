/* Ensure this file is consistent with ./types.ts */

import type {
	JsonSheet,
	ExpandedJsonSheet,
	AutoFitCellSizesOptions,
	ExpandedAutoFitCellSizesOptions,
	JsonToExcelOptions,
	ExpandedJsonToExcelOptions
} from './types';

export function expandAutoFitCellSizesOptions(options: AutoFitCellSizesOptions): ExpandedAutoFitCellSizesOptions {
	if (options.maxHeight && options.maxHeight > 408) {
		throw new Error(`autoFitCellSizesOptions.maxHeight cannot be greater than 408, got ${options.maxHeight}`);
	}

	if (options.maxWidth && options.maxWidth > 254) {
		throw new Error(`autoFitCellSizesOptions.maxWidth cannot be greater than 254, got ${options.maxWidth}`);
	}

	return {
		minHeight: options.minHeight ?? 15,
		maxHeight: options.maxHeight ?? 408,
		minWidth: options.minWidth ?? 6,
		maxWidth: options.maxWidth ?? 170,
		horizontalPadding: options.horizontalPadding ?? 3,
		verticalPadding: options.verticalPadding ?? 2
	};
}

export function expandJsonSheet(sheet: JsonSheet): ExpandedJsonSheet {
	return {
		sheetName: sheet.sheetName.replace(/\r?\n/g, '\n'),
		data: sheet.data,
		formatAsTable: sheet.formatAsTable ?? false,
		tableTheme: sheet.tableTheme ?? 'TableStyleMedium9', // Medium blue
		autoTrimWhitespace: sheet.autoTrimWhitespace ?? true,
		autoFitCellSizes: sheet.autoFitCellSizes ?? true,
		autoFitCellSizesOptions: expandAutoFitCellSizesOptions(sheet.autoFitCellSizesOptions ?? {})
	};
}

export function expandJsonToExcelOptions(options: JsonToExcelOptions): ExpandedJsonToExcelOptions {
	return {
		overwrite: options.overwrite ?? false,
		normalizeLinefeeds: options.normalizeLinefeeds ?? true,
		linefeedLimitChecking: options.linefeedLimitChecking ?? 'legacy'
	};
}
