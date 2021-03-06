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
		depositBalance: DataTypes.DOUBLE,
		depositAverage: DataTypes.DOUBLE,
		otherBalance: DataTypes.DOUBLE,
		otherAverage: DataTypes.DOUBLE,
		rate: DataTypes.DOUBLE,
		balance: DataTypes.DOUBLE,
		average: DataTypes.DOUBLE,
		contribution: DataTypes.INTEGER
	}, {
		tableName: `${namespace}customer_contribution`
	});
};
