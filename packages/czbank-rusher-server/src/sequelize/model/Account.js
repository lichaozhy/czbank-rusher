const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function Account(sequelize, namespace) {
	sequelize.define('Account', {
		id: {
			type: DataTypes.CHAR(32),
			primaryKey: true
		},
		customerId: DataTypes.CHAR(32),
		internalCode: DataTypes.CHAR(),
		assetTotal: DataTypes.DOUBLE,
	}, {
		tableName: `${namespace}account`
	});
};
