const { Sequelize } = require('sequelize');
const path = require('path');

const Model = {
	Account: require('./model/Account'),
	AccountData: require('./model/AccountData'),
	AccountDataFile: require('./model/AccountDataFile'),
	AccountDataPlan: require('./model/AccountDataPlan'),
	AccountProductData: require('./model/AccountProductData'),
	Customer: require('./model/Customer'),
	CustomerPoint: require('./model/CustomerPoint'),
	CustomerPointAdjustment: require('./model/CustomerPointAdjustment'),
	CustomerRelation: require('./model/CustomerRelation'),
	Manager: require('./model/Manager'),
	Present: require('./model/Present'),
	Product: require('./model/Product'),
	ProductAccountDataSetting: require('./model/ProductAccountDataSetting'),
	AdjustmentReasonCustomer: require('./model/AdjustmentReason/Customer'),
	AdjustmentReasonManual: require('./model/AdjustmentReason/Manual'),
	AdjustmentReasonPresent: require('./model/AdjustmentReason/Present')
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
	} = _options;

	options.storage = _storage;
	options.namespace = _namespace;
	options.onLog = _onLog;

	return options;
}

const ASSOCIATION_BASIC_OPTIONS = {
	foreignKeyConstraint: false,
	constraints: false
};

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

	Object.keys(Model).forEach(modelName => {
		Model[modelName](sequelize, finalOptions.namespace);
	});

	const Product = sequelize.model('Product');
	const ProductAccountDataSetting = sequelize.model('ProductAccountDataSetting');

	Product.hasOne(ProductAccountDataSetting, Object.assign({
		foreignKey: 'productId'
	}, ASSOCIATION_BASIC_OPTIONS));

	ProductAccountDataSetting.belongsTo(Product, ASSOCIATION_BASIC_OPTIONS);

	const AccountDataFile = sequelize.model('AccountDataFile');
	const AccountDataPlan = sequelize.model('AccountDataPlan');
	const Manager = sequelize.model('Manager');

	AccountDataFile.belongsTo(AccountDataPlan, Object.assign({
		foreignKey: 'planId'
	}, ASSOCIATION_BASIC_OPTIONS));

	AccountDataFile.belongsTo(Manager, Object.assign({
		foreignKey: 'managerId'
	}, ASSOCIATION_BASIC_OPTIONS));

	return sequelize;
};
