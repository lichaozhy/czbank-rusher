const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function ProductAccountDataSetting(sequelize, namespace) {
	sequelize.define('ProductAccountDataSetting', {
		productId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		fieldIndexOfAverageDeposit: DataTypes.TINYINT,
		fieldIndexOfBalance: DataTypes.TINYINT
	}, {
		tableName: `${namespace}product_account_data_setting`
	});
}
