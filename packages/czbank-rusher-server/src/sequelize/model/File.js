const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function File(sequelize, namespace) {
	sequelize.define('File', {
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
		tableName: `${namespace}file`
	});
};
