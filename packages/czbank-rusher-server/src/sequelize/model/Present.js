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
		price: DataTypes.FLOAT,
		point: DataTypes.INTEGER,
		enabled: DataTypes.BOOLEAN,
		description: DataTypes.STRING,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	}, {
		tableName: `${namespace}present`
	});
};
