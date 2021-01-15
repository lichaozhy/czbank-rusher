const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function CustomerPoint(sequelize, namespace) {
	sequelize.define('CustomerPoint', {
		customerId: {
			type: DataTypes.CHAR(32),
			primaryKey: true
		},
		pointTotal: DataTypes.INTEGER
	}, {
		tableName: `${namespace}customer_point`
	});
};
