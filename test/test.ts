import test from 'ava';
import { exportJsonToExcel } from '../source';
import { getStringHeight } from '../source/auto-sizes';
import { getMax, getSum } from '../source/numeric-helpers';
import { predictAmountOfLineWraps } from '../source/visual-string-width';
import jetpack = require('fs-jetpack');
import tempy = require('tempy');

test('Number[] helpers work', t => {
	t.is(getMax([-3, 2, 1]), 2);
	t.is(getMax([-3]), -3);
	t.is(getSum([-3, 2, 1]), 0);
	t.is(getSum([-3]), -3);
	t.is(getSum([]), 0);
});

test('predictAmountOfLineWraps work', t => {
	t.is(
		// 'a' has width 1
		predictAmountOfLineWraps('a'.repeat(10), 4),
		2 // 'aaaa\naaaa\naa'
	);
	t.is(
		// Space has width 0.4
		predictAmountOfLineWraps(' '.repeat(25), 4),
		2 // `${' '.repeat(10)}\n${' '.repeat(10)}\n${' '.repeat(5)}`
	);
});

test('getStringHeight works', t => {
	t.is(getStringHeight('', 3), 1);
	t.is(getStringHeight('foobar', 6), 1);
	t.is(getStringHeight('foobar', 5), 2);
	t.is(getStringHeight('foobar', 3), 2);
	t.is(getStringHeight('foobar', 1), 6);
	t.is(getStringHeight('foobar', Infinity), 1);
	t.is(getStringHeight('foobar\nfoobar', 6), 2);
	t.is(getStringHeight('foobar\nfoobar', 5), 4);
	t.is(getStringHeight('foobar\nfoobar', 3), 4);
	t.is(getStringHeight('foobar\nfoobar', 1), 12);
	t.is(getStringHeight('foobar\nfoobar', Infinity), 2);
	t.is(getStringHeight('foobar\n_', 6), 2);
	t.is(getStringHeight('foobar\n_', 5), 3);
	t.is(getStringHeight('foobar\n_', 3), 3);
	t.is(getStringHeight('foobar\n_', 1), 7);
	t.is(getStringHeight('foobar\n_', Infinity), 2);
});

function getDummyData(): string[][] {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	return [...new Array(300)].map(() => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		return [...new Array(100)].map(() => {
			return `${Math.random()}`;
		});
	});
}

test('Generates with lots of data', async t => {
	const sheet = {
		sheetName: 'Hello World 123',
		data: getDummyData(),
		formatAsTable: true
	};

	const dir = jetpack.cwd(tempy.directory());

	await exportJsonToExcel(dir.path('foo.xlsx'), [sheet]);

	t.is(dir.exists('foo.xlsx'), 'file');

	await dir.removeAsync('.');
});

test('`beforeSave` hook works', async t => {
	const sheet = {
		sheetName: 'Hello World 123',
		data: getDummyData(),
		formatAsTable: true
	};

	const dir = jetpack.cwd(tempy.directory());

	await exportJsonToExcel(dir.path('foo.xlsx'), [sheet], {
		beforeSave(workbook) {
			workbook.creator = 'Someone';
			workbook.lastModifiedBy = 'Someone Else';
			workbook.getWorksheet(1).getCell('C3').font = {
				bold: true
			};
		}
	});

	t.is(dir.exists('foo.xlsx'), 'file');

	await dir.removeAsync('.');
});

test('Refuses to overwrite unless option is set', async t => {
	const sheet = {
		sheetName: 'Foo',
		data: [['Foo', 'Bar']]
	};

	const dir = jetpack.cwd(tempy.directory());
	const filePath = dir.path('foo.xlsx');
	const dummyContent = `foobar ${Math.random()}`;

	await jetpack.writeAsync(filePath, dummyContent);

	await t.throwsAsync(async () => exportJsonToExcel(filePath, [sheet]));
	t.is(await jetpack.readAsync(filePath), dummyContent);

	await t.notThrowsAsync(async () => exportJsonToExcel(filePath, [sheet], { overwrite: true }));

	await dir.removeAsync('.');
});
