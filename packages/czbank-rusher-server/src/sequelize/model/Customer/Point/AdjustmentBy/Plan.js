const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function CustomerPointAdjustmentByPlan(sequelize, namespace) {
	sequelize.define('CustomerPointAdjustmentByPlan', {
		adjustmentId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		planId: DataTypes.CHAR(64),
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}customer_point_adjustment_by_plan`
	});
};
