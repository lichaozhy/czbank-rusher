const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function Present(sequelize, namespace) {
	sequelize.define('Present', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.CHAR(64),
		RMBPrice: DataTypes.FLOAT,
		pointPrice: DataTypes.FLOAT,
		description: DataTypes.STRING,
	}, {
		tableName: `${namespace}present`
	});
}
