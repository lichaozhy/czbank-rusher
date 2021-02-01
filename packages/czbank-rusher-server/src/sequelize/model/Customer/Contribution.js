const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function CustomerContribution(sequelize, namespace) {
	sequelize.define('CustomerContribution', {
		customerDataId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		value: DataTypes.INTEGER
	}, {
		tableName: `${namespace}customer_contribution`
	});
};
