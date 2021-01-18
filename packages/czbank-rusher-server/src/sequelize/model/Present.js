const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function Present(sequelize, namespace) {
	sequelize.define('Present', {
		id: {
			type: DataTypes.CHAR(32),
			primaryKey: true
		},
		name: DataTypes.CHAR(32),
		RMBPrice: DataTypes.FLOAT,
		pointPrice: DataTypes.FLOAT,
		description: DataTypes.STRING,
	}, {
		tableName: `${namespace}present`
	});
}
