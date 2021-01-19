const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AccountProductData(sequelize, namespace) {
	sequelize.define('AccountProductData', {
		dataId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		productId: DataTypes.CHAR(64),
		averageDeposit: DataTypes.DOUBLE,
		balance: DataTypes.DOUBLE
	}, {
		tableName: `${namespace}account_product_data`
	});
}
