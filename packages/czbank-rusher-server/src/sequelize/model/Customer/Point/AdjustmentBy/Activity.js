const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function CustomerPointAdjustmentByActivity(sequelize, namespace) {
	sequelize.define('CustomerPointAdjustmentByActivity', {
		adjustmentId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		activityId: DataTypes.CHAR(64),
		point: DataTypes.INTEGER,
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}customer_point_adjustment_by_activity`
	});
};
