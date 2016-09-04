'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var rollupPluginutils = require('rollup-pluginutils');
var eslint = require('eslint');

function normalizePath(id) {
	return path.relative(process.cwd(), id).split(path.sep).join('/');
}

function eslint$1(options) {
	if ( options === void 0 ) options = {};

	var cli = new eslint.CLIEngine(options);
	var formatter = options.formatter;

	if (typeof formatter !== 'function') {
		formatter = cli.getFormatter(formatter || 'stylish');
	}

	var filter = rollupPluginutils.createFilter(
		options.include,
		options.exclude || 'node_modules/**'
	);

	return {
		name: 'eslint',

		transform: function transform(code, id) {
			var file = normalizePath(id);
			if (cli.isPathIgnored(file) || !filter(id)) {
				return null;
			}

			var report = cli.executeOnText(code, file);
			if (!report.errorCount && !report.warningCount) {
				return null;
			}

			var result = formatter(report.results);
			if (result) {
				console.log(result);
			}

			if (options.throwError) {
				throw Error('Warnings or errors were found');
			}
		}
	};
}

module.exports = eslint$1;