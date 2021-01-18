const path = require('path');
const fs = require('fs-extra');

module.exports = function ProduckWorkspace() {
	const workspace = {
		root: path.resolve(),
		map: {}
	};

	const Method = {
		async buildAll() {
			await Method.buildRoot();
			await Object.keys(workspace.map).map(name => Method.build(name));
		},
		async buildRoot() {
			return fs.ensureDir(workspace.root);
		},
		async build(name) {
			const pathnmae = workspace.map[name];

			if (pathnmae) {
				return fs.ensureDir(workspace.map[name]);
			}
		},
		set root(pathname) {
			workspace.root = path.resolve(pathname);
		},
		get root() {
			return workspace.root
		},
		setPath(name, pathname, fromRoot = true) {
			if (fromRoot) {
				map[name] = path.join(workspace.root, pathname);
			} else {
				map[name] = path.resolve(pathname);
			}
		},
		getPath(name) {
			return map[name];
		}
	}

	return {
		id: 'org.produck.workspace',
		name: 'DuckWorkspace',
		install(injection) {
			injection.Workspace = Method;
		}
	}
}
