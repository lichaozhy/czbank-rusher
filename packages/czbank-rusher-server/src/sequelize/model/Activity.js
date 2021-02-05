const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function Activity(sequelize, namespace) {
	sequelize.define('Activity', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.STRING,
		description: DataTypes.STRING,
		startedAt: DataTypes.DATE,
		endedAt: DataTypes.DATE,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	}, {
		tableName: `${namespace}activity`
	});
};
