const { Sequelize } = require('sequelize');
const path = require('path');

const Model = {
	Account: require('./model/Account'),
	AccountData: require('./model/AccountData'),
	Customer: require('./model/Customer'),
	CustomerRelation: require('./model/CustomerRelation'),
	Manager: require('./model/Manager'),
	Present: require('./model/Present'),
	PointAdjustment: require('./model/PointAdjustment'),
	Point: require('./model/Point');
};

function normalize(_options) {
	const options = {
		storage: path.resolve('output/czbrusher.sqlite'),
		namespace: '',
		onLog: sql => console.log(sql)
	};

	const {
		storage: _storage = options.storage,
		namespace: _namespace = options.namespace,
		onLog: _onLog = options.onLog
	} = _options

	options.storage = _storage;
	options.namespace = _namespace;
	options.onLog = _onLog;

	return options;
}

module.exports = function CZBRusherSequelize(options) {
	const finalOptions = normalize(options);

	const sequelize = new Sequelize({
		dialect: 'sqlite',
		storage:
	});

	return sequelize;
};
