const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function CustomerProductData(sequelize, namespace) {
	sequelize.define('CustomerProductData', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		customerDataId: DataTypes.CHAR(64),
		productCode: DataTypes.CHAR(64),
		average: DataTypes.DOUBLE,
		balance: DataTypes.DOUBLE
	}, {
		tableName: `${namespace}customer_product_data`
	});
};
