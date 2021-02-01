const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AccountData(sequelize, namespace) {
	sequelize.define('AccountData', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		accountId: DataTypes.CHAR(64),
		fileId: DataTypes.CHAR(64)
	}, {
		tableName: `${namespace}account_data`
	});
};
