const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function Plan(sequelize, namespace) {
	sequelize.define('Plan', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.CHAR(64),
		description: DataTypes.STRING,
		dateAs: DataTypes.DATEONLY,
		setting: DataTypes.TEXT,
		createdAt: DataTypes.DATE
	}, {
		tableName: `${namespace}plan`
	});
};
