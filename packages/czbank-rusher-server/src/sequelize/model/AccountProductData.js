const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function AccountProductData(sequelize, namespace) {
	sequelize.define('AccountProductData', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		dataId: DataTypes.CHAR(64),
		productCode: DataTypes.CHAR(64),
		average: DataTypes.DOUBLE,
		balance: DataTypes.DOUBLE
	}, {
		tableName: `${namespace}account_product_data`
	});
};
