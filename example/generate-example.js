require('log-process-errors')();

const { exportJsonToExcel } = require('..');

(async () => {
	console.log('Will now generate the example file from readme using Node.js.');

	await exportJsonToExcel(
		'example/example.xlsx',
		[
			{
				sheetName: 'Hello World',
				data: [
					['Foo', 'Bar', 'Baz'],
					['A large string here but with\none line break', 'Hi', 'Test'],
					[
						'\'starting single quote\nis rendered normally',
						'Lots\nof\nline\nbreaks',
						'Auto-fits cells with a little extra margin'
					],
					['Nice!', '', 'Quick and to the point!']
				],
				formatAsTable: true
			}
		],
		{
			overwrite: true
		}
	);

	console.log('Done!');
})();
