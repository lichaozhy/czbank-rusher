const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AdjustmentReasonManual(sequelize, namespace) {
	sequelize.define('AdjustmentReasonManual', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		adjustmentId: DataTypes.CHAR(64),
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}adjustment_reason_manual`
	});
};
