const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function Customer(sequelize, namespace) {
	sequelize.define('Customer', {
		id: {
			type: DataTypes.CHAR(32),
			primaryKey: true
		},
		managerId: DataTypes.CHAR(32),
		name: DataTypes.STRING,
		gender: DataTypes.TINYINT,
		mobilePhone: DataTypes.CHAR(16),
		identificationCode: DataTypes.CHAR(18),
		assetTotal: DataTypes.DOUBLE
	}, {
		tableName: `${namespace}customer`
	});
};
