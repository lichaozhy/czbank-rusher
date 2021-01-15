const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AccountData(sequelize, namespace) {
	sequelize.define('AccountData', {
		id: {
			type: DataTypes.CHAR(32),
			primaryKey: true
		},
		planId: DataTypes.CHAR(32),
		accountId: DataTypes.CHAR(32)
	}, {
		tableName: `${namespace}account_data`
	});
}
