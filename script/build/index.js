const { exec } = require('pkg');
const path = require('path');
const fs = require('fs-extra');

const publicPath = path.resolve('output');

const PACKAGES = [
	{
		name: 'CZBRusher',
		pathname: path.join(__dirname, '../../packages/czbank-rusher-server'),
		async builded() {
			const DistPath = {
				administrator:  path.join(__dirname, '../../packages/czbank-rusher-workbench/dist'),
				manager: path.join(__dirname, '../../packages/czbank-rusher-manager-client/dist')
			};

			for (const name in DistPath) {
				await fs.copy(DistPath[name], path.join(publicPath, `www/${name}`));
			}
		}
	}
];

async function pkg(pathname, outputName) {
	console.log(`====== Packing: ${outputName} ======`);
	console.log(`Packing ${outputName} from '${pathname}' ...\n`);

	await exec([
		pathname,
		'--output', path.join(publicPath, `${outputName}.exe`)
	]);

	console.log('\n------ END ------\n\n');
}

(async function build() {
	const sqlite3Path = path.join(PACKAGES[0].pathname, 'node_modules/sqlite3');
	const bindingScriptPath = path.join(sqlite3Path, './lib/sqlite3-binding.js');
	const nodeModulePath = path.join(sqlite3Path, './build-tmp-napi-v3/Release/node_sqlite3.node');

	await fs.rename(bindingScriptPath, `${bindingScriptPath}.backup`);
	await fs.copyFile(path.join(__dirname, 'resource/sqlite3.binding.js'), bindingScriptPath);

	for (const app of PACKAGES) {
		await pkg(app.pathname, app.name);

		if (app.builded) {
			await app.builded();
		}
	}

	await fs.remove(bindingScriptPath);
	await fs.rename(`${bindingScriptPath}.backup`, bindingScriptPath);
	await fs.copy(nodeModulePath, path.join(publicPath, 'node_sqlite3.node'));

	await fs.copy(
		path.join(__dirname, 'resource/config.example.json'),
		path.join(publicPath, 'config.json')
	);
}());
