const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AdjustmentReasonPresent(sequelize, namespace) {
	sequelize.define('AdjustmentReasonPresent', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		adjustmentId: DataTypes.CHAR(64),
		presentId: DataTypes.CHAR(64),
		amount: DataTypes.INTEGER,
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}adjustment_reason_present`
	});
};
