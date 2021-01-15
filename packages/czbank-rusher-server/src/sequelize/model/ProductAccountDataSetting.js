const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function ProductAccountDataSetting(sequelize, namespace) {
	sequelize.define('Product', {
		productId: {
			type: DataTypes.CHAR(32),
			primaryKey: true
		},
		fieldIndexOfAverageDeposit: DataTypes.TINYINT,
		fieldIndexOfBalance: DataTypes.TINYINT
	}, {
		tableName: `${namespace}product_account_data_setting`
	});
}