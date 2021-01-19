const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AccountDataPlan(sequelize, namespace) {
	sequelize.define('AccountDataPlan', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.CHAR(64),
		description: DataTypes.STRING,
		dateAs: DataTypes.DATEONLY,
		setting: DataTypes.TEXT,
		resolved: DataTypes.BOOLEAN,
		createdAt: DataTypes.DATE
	}, {
		tableName: `${namespace}account_data_plan`
	});
}
