const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function ManagerContribution(sequelize, namespace) {
	sequelize.define('ManagerContribution', {
		ManagerDataId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		value: DataTypes.INTEGER
	}, {
		tableName: `${namespace}manager_contribution`
	});
};
