const { Sequelize } = require('sequelize');
const path = require('path');

const Model = {
	Account: require('./model/Account'),
	AccountData: require('./model/AccountData'),
	AccountDataPlan: require('./model/AccountDataPlan'),
	Customer: require('./model/Customer'),
	CustomerRelation: require('./model/CustomerRelation'),
	Manager: require('./model/Manager'),
	Present: require('./model/Present'),
	PointAdjustment: require('./model/PointAdjustment'),
	Point: require('./model/Point')
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

module.exports = function CZBankRusherSequelize(options) {
	const finalOptions = normalize(options);

	const sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: finalOptions.storage,
		define: {
			underscored: true,
			timestamps: false,
			freezeTableName: true
		},
		logging: finalOptions.onLog
	});

	Object.keys(Models).forEach(modelName => {
		Models[modelName](sequelize, finalOptions.namespace);
	});

	return sequelize;
};
