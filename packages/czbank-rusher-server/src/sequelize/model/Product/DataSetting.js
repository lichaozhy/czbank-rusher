const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function ProductDataSetting(sequelize, namespace) {
	sequelize.define('ProductDataSetting', {
		productId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		fieldIndexOfAverage: DataTypes.TINYINT,
		fieldIndexOfBalance: DataTypes.TINYINT
	}, {
		tableName: `${namespace}product_data_setting`
	});
};
