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
		batchId: DataTypes.CHAR(64),
	}, {
		tableName: `${namespace}customer_point_adjustment_by_plan_variation`
	});

	sequelize.define('PointBatchByPlanVariation', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		baseId: DataTypes.CHAR(64),
		targetId: DataTypes.CHAR(64),
		point: DataTypes.INTEGER,
		customerCount: DataTypes.INTEGER,
		description: DataTypes.STRING,
		createdAt: DataTypes.DATE
	}, {
		tableName: `${namespace}point_batch_by_plan_variation`
	});
};
