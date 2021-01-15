const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AdjustmentReasonPresent(sequelize, namespace) {
	sequelize.define('AdjustmentReasonPresent', {
		id: {
			type: DataTypes.CHAR(32),
			primaryKey: true
		},
		adjustmentId: DataTypes.CHAR(32),
		presentId: DataTypes.CHAR(32),
		amount: DataTypes.INTEGER,
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}adjustment_reason_present`
	});
};
