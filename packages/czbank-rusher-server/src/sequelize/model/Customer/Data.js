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
		customerId: DataTypes.CHAR(64),
		managerId: DataTypes.CHAR(64),
		fileId: DataTypes.CHAR(64)
	}, {
		tableName: `${namespace}customer_data`
	});
};
