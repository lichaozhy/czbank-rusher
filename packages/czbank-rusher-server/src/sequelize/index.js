const { Sequelize } = require('sequelize');
const { FK } = require('./utils');
const normalize = require('./normalize');

const ModelFactory = {
	AccountData: require('./model/Account/Data'),
	AccountProductData: require('./model/Account/ProductData'),
	CustomerPointAdjustmentByActivity: require('./model/Customer/Point/AdjustmentBy/Activity'),
	CustomerPointAdjustmentByManual: require('./model/Customer/Point/AdjustmentBy/Manual'),
	CustomerPointAdjustmentByPlan: require('./model/Customer/Point/AdjustmentBy/Plan'),
	CustomerPointAdjustmentByPresent: require('./model/Customer/Point/AdjustmentBy/Present'),
	CustomerPointAdjustment: require('./model/Customer/Point/Adjustment'),
	CustomerContribution: require('./model/Customer/Contribution'),
	CustomerData: require('./model/Customer/Data'),
	CustomerPoint: require('./model/Customer/Point'),
	CustomerProductData: require('./model/Customer/ProductData'),
	CustomerRelation: require('./model/Customer/Relation'),
	ManagerContribution: require('./model/Manager/Contribution'),
	ManagerData: require('./model/Manager/Data'),
	ManagerProductData: require('./model/Manager/ProductData'),
	ProductDataSetting: require('./model/Product/DataSetting'),
	Account: require('./model/Account'),
	Activity: require('./model/Activity'),
	Customer: require('./model/Customer'),
	File: require('./model/File'),
	Manager: require('./model/Manager'),
	Plan: require('./model/Plan'),
	Present: require('./model/Present'),
	Product: require('./model/Product'),
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

	for(const name in ModelFactory) {
		ModelFactory[name](sequelize, finalOptions.namespace);
	}

	/**
	 * Associations
	 */
	const Model = {
		AccountData: sequelize.model('AccountData'),
		AccountProductData: sequelize.model('AccountProductData'),
		CustomerPointAdjustmentByActivity: sequelize.model('CustomerPointAdjustmentByActivity'),
		CustomerPointAdjustmentByManual: sequelize.model('CustomerPointAdjustmentByManual'),
		CustomerPointAdjustmentByPlan: sequelize.model('CustomerPointAdjustmentByPlan'),
		CustomerPointAdjustmentByPresent: sequelize.model('CustomerPointAdjustmentByPresent'),
		CustomerPointAdjustment: sequelize.model('CustomerPointAdjustment'),
		CustomerContribution: sequelize.model('CustomerContribution'),
		CustomerData: sequelize.model('CustomerData'),
		CustomerPoint: sequelize.model('CustomerPoint'),
		CustomerProductData: sequelize.model('CustomerProductData'),
		CustomerRelation: sequelize.model('CustomerRelation'),
		ManagerContribution: sequelize.model('ManagerContribution'),
		ManagerData: sequelize.model('ManagerData'),
		ManagerProductData: sequelize.model('ManagerProductData'),
		ProductDataSetting: sequelize.model('ProductDataSetting'),
		Account: sequelize.model('Account'),
		Activity: sequelize.model('Activity'),
		Customer: sequelize.model('Customer'),
		File: sequelize.model('File'),
		Manager: sequelize.model('Manager'),
		Plan: sequelize.model('Plan'),
		Present: sequelize.model('Present'),
		Product: sequelize.model('Product')
	};

	Model.File.belongsTo(Model.Manager, FK('managerId'));
	Model.Manager.hasMany(Model.File, FK('managerId'));
	Model.File.belongsTo(Model.Plan, FK('planId'));
	Model.Plan.hasMany(Model.File, FK('planId'));
	Model.File.hasMany(Model.AccountData, FK('fileId'));
	Model.AccountData.belongsTo(Model.File, FK('fileId'));
	Model.AccountData.hasMany(Model.AccountProductData, FK('accountDataId'));
	Model.AccountProductData.belongsTo(Model.AccountData, FK('accountDataId'));
	Model.AccountData.belongsTo(Model.Account, FK('accountId'));
	Model.Account.hasMany(Model.AccountData, FK('accountId'));
	Model.Account.belongsTo(Model.Customer, FK('customerId'));
	Model.Customer.hasMany(Model.Account, FK('customerId'));
	Model.CustomerData.belongsTo(Model.Customer, FK('customerId'));
	Model.Customer.hasMany(Model.CustomerData, FK('customerId'));
	Model.CustomerData.belongsTo(Model.File, FK('fileId'));
	Model.File.hasMany(Model.CustomerData, FK('fileId'));
	Model.CustomerData.hasMany(Model.CustomerProductData, FK('customerDataId'));
	Model.CustomerProductData.belongsTo(Model.CustomerData, FK('customerDataId'));
	Model.Customer.hasOne(Model.CustomerPoint, FK('customerId'));
	Model.CustomerPoint.belongsTo(Model.Customer, FK('customerId'));
	Model.Customer.hasMany(Model.CustomerPointAdjustment, FK('customerId'));
	Model.CustomerPointAdjustment.belongsTo(Model.Customer, FK('customerId'));
	Model.CustomerData.belongsTo(Model.Manager, FK('managerId'));
	Model.Manager.hasMany(Model.CustomerData, FK('managerId'));
	Model.CustomerData.hasOne(Model.CustomerContribution, FK('customerDataId'));
	Model.CustomerContribution.belongsTo(Model.CustomerData, FK('customerDataId'));
	Model.Manager.hasMany(Model.ManagerData, FK('managerId'));
	Model.ManagerData.belongsTo(Model.Manager, FK('managerId'));
	Model.ManagerData.hasMany(Model.ManagerProductData, FK('managerDataId'));
	Model.ManagerProductData.belongsTo(Model.ManagerData, FK('managerDataId'));
	Model.ManagerData.belongsTo(Model.File, FK('fileId'));
	Model.File.hasMany(Model.ManagerData, FK('fileId'));

	Model.Product.hasOne(Model.ProductDataSetting, FK('productId'));
	Model.ProductDataSetting.belongsTo(Model.Product, FK('productId'));

	const adjustmentFK = FK('adjustmentId');

	Model.CustomerPointAdjustment.hasMany(Model.CustomerPointAdjustmentByActivity, adjustmentFK);
	Model.CustomerPointAdjustment.hasMany(Model.CustomerPointAdjustmentByManual, adjustmentFK);
	Model.CustomerPointAdjustment.hasMany(Model.CustomerPointAdjustmentByPlan, adjustmentFK);
	Model.CustomerPointAdjustment.hasMany(Model.CustomerPointAdjustmentByPresent, adjustmentFK);
	Model.CustomerPointAdjustmentByActivity.belongsTo(Model.CustomerPointAdjustment, adjustmentFK);
	Model.CustomerPointAdjustmentByManual.belongsTo(Model.CustomerPointAdjustment, adjustmentFK);
	Model.CustomerPointAdjustmentByPlan.belongsTo(Model.CustomerPointAdjustment, adjustmentFK);
	Model.CustomerPointAdjustmentByPresent.belongsTo(Model.CustomerPointAdjustment, adjustmentFK);

	Model.CustomerPointAdjustmentByPlan.belongsTo(Model.Plan, FK('planId'));
	Model.CustomerPointAdjustmentByPresent.belongsTo(Model.Present, FK('presentId'));
	Model.CustomerPointAdjustmentByActivity.belongsTo(Model.Activity, FK('activityId'));
	Model.Plan.hasOne(Model.CustomerPointAdjustmentByPlan, FK('planId'));
	Model.Present.hasMany(Model.CustomerPointAdjustmentByPresent, FK('presentId'));
	Model.Activity.hasMany(Model.CustomerPointAdjustmentByActivity, FK('activityId'));

	return { sequelize, Model };
};
