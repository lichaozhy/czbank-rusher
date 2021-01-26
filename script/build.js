const { exec } = require('pkg');
const path = require('path');
const fs = require('fs-extra');

const publicPath = path.join(__dirname, '../output');

const PACKAGES = [
	{
		name: 'CZBRusher',
		pathname: path.join(__dirname, '../packages/czbank-rusher-server'),
		async builded() {
			const workbenchDistPath = path.join(__dirname, '../packages/czbank-rusher-workbench/dist');
			const wwwPath = path.join(publicPath, 'www');

			await fs.copy(workbenchDistPath, wwwPath);

			// const sqlite3Path = require.resolve('leveldown');
			// const prebuildsPath = path.join(sqlite3Path, '../prebuilds');

			// await fs.copy(prebuildsPath, path.join(publicPath, 'prebuilds'));
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
	for (const app of PACKAGES) {
		await pkg(app.pathname, app.name);

		if (app.builded) {
			await app.builded();
		}
	}
}());
