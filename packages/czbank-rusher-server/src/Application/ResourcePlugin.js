const Resource = require('./Resource');

module.exports = function ResourcePlugin() {
	return function install(injection) {
		injection.Resource = Resource;
	};
};
