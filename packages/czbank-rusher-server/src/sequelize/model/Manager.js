const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function Manager(sequelize, namespace) {
	sequelize.define('Manager', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.STRING,
		code: DataTypes.CHAR(64),
	}, {
		tableName: `${namespace}manager`
	});
};
