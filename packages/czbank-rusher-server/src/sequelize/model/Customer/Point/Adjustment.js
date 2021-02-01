const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function CustomerPointAdjustment(sequelize, namespace) {
	sequelize.define('CustomerPointAdjustment', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		customerId: DataTypes.CHAR(64),
		value: DataTypes.INTEGER,
		type: DataTypes.INTEGER,
		createdAt: DataTypes.DATE
	}, {
		tableName: `${namespace}customer_point_adjustment`
	});
};
