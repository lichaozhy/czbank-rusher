const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AdjustmentReasonActivity(sequelize, namespace) {
	sequelize.define('AdjustmentReasonActivity', {
		adjustmentId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		activityId: DataTypes.CHAR(64),
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}adjustment_reason_activity`
	});
};
