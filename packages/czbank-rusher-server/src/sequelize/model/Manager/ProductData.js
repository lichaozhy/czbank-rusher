const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function ManagerProductData(sequelize, namespace) {
	sequelize.define('ManagerProductData', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		managerDataId: DataTypes.CHAR(64),
		productCode: DataTypes.CHAR(64),
		average: DataTypes.DOUBLE,
		balance: DataTypes.DOUBLE
	}, {
		tableName: `${namespace}manager_product_data`
	});
};
