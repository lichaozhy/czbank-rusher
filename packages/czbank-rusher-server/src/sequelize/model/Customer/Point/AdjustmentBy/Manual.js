const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function CustomerPointAdjustmentByManual(sequelize, namespace) {
	sequelize.define('CustomerPointAdjustmentByManual', {
		adjustmentId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}customer_point_adjustment_by_manual`
	});
};
