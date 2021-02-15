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
		batchId: DataTypes.CHAR(64),
	}, {
		tableName: `${namespace}customer_point_adjustment_by_plan`
	});

	sequelize.define('PointBatchByPlan', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		planId: DataTypes.CHAR(64),
		point: DataTypes.INTEGER,
		description: DataTypes.STRING,
		createdAt: DataTypes.DATE
	}, {
		tableName: `${namespace}point_batch_by_plan`
	});
};
