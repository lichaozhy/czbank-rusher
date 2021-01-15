const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AdjustmentReasonCustomer(sequelize, namespace) {
	sequelize.define('AdjustmentReasonCustomer', {
		id: {
			type: DataTypes.CHAR(32),
			primaryKey: true
		},
		adjustmentId: DataTypes.CHAR(32),
		planId: DataTypes.CHAR(32),
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}adjustment_reason_customer`
	});
};
