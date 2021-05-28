import FileSaver from 'file-saver';
import type { JsonSheet, ExportJsonToExcelOptions } from './types';
import { jsonToExcel } from './json-to-excel';
import { expandExportJsonToExcelOptions } from './defaults';

export async function exportJsonToExcelBrowser(fileName: string, sheets: JsonSheet[], options?: ExportJsonToExcelOptions): Promise<void> {
	const expandedOptions = expandExportJsonToExcelOptions(options);

	const workbook = jsonToExcel(sheets, expandedOptions);

	await expandedOptions.beforeSave(workbook);

	const excelBuffer = await workbook.xlsx.writeBuffer();

	const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

	FileSaver.saveAs(data, fileName);
}
