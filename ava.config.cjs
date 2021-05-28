module.exports = {
	verbose: true,
	require: ['source-map-support/register'],
	typescript: {
		rewritePaths: {
			'source/': 'dist/source/',
			'test/': 'dist/test/'
		}
	},
	timeout: '1m'
};
