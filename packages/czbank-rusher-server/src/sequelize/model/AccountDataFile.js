const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AccountDataFile(sequelize, namespace) {
	sequelize.define('AccountDataFile', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		planId: DataTypes.CHAR(64),
		managerId: DataTypes.CHAR(64),
		size: DataTypes.INTEGER,
		customerNumber: DataTypes.INTEGER,
		accountNumber: DataTypes.INTEGER,
		description: DataTypes.STRING,
		createdAt: DataTypes.DATE
	}, {
		tableName: `${namespace}account_data_file`
	});
};
