const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AccountData(sequelize, namespace) {
	sequelize.define('Product', {
		id: {
			type: DataTypes.CHAR(32),
			primaryKey: true
		},
		name: DataTypes.CHAR(32),
		code: DataTypes.CHAR(64),
		description: DataTypes.STRING,
	}, {
		tableName: `${namespace}product`
	});
}
