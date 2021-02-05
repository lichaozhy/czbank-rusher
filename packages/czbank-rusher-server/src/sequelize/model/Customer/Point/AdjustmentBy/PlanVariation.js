const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function CustomerPointAdjustmentByPlanVariation(sequelize, namespace) {
	sequelize.define('CustomerPointAdjustmentByPlanVariation', {
		adjustmentId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		originPlanId: DataTypes.CHAR(64),
		targetPlanId: DataTypes.CHAR(64),
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}customer_point_adjustment_by_plan_variation`
	});
};
