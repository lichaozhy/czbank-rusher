const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AdjustmentReasonCustomer(sequelize, namespace) {
	sequelize.define('AdjustmentReasonCustomer', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		adjustmentId: DataTypes.CHAR(64),
		planId: DataTypes.CHAR(64),
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}adjustment_reason_customer`
	});
};
