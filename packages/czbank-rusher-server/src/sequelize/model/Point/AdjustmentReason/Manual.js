const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AdjustmentReasonManual(sequelize, namespace) {
	sequelize.define('AdjustmentReasonManual', {
		adjustmentId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}adjustment_reason_manual`
	});
};
