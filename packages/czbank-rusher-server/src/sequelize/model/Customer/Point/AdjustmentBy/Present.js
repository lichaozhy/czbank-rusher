const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function CustomerPointAdjustmentByPresent(sequelize, namespace) {
	sequelize.define('CustomerPointAdjustmentByPresent', {
		adjustmentId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		presentId: DataTypes.CHAR(64),
		amount: DataTypes.INTEGER,
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}customer_point_adjustment_by_present`
	});
};
