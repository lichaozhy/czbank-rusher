const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function Product(sequelize, namespace) {
	sequelize.define('Product', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.CHAR(64),
		code: DataTypes.CHAR(64),
		description: DataTypes.STRING,
	}, {
		tableName: `${namespace}product`
	});
}
