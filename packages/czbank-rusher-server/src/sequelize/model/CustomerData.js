const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function CustomerData(sequelize, namespace) {
	sequelize.define('CustomerData', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		planId: DataTypes.CHAR(64),
		customerId: DataTypes.CHAR(64),
		fileId: DataTypes.CHAR(64)
	}, {
		tableName: `${namespace}customer_data`
	});
};
