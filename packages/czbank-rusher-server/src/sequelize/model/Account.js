const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function Account(sequelize, namespace) {
	sequelize.define('Account', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		customerId: DataTypes.CHAR(64),
		internalCode: DataTypes.CHAR(22),
		code: DataTypes.STRING
	}, {
		tableName: `${namespace}account`
	});
};
