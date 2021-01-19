const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function CustomerRelation(sequelize, namespace) {
	sequelize.define('CustomerRelation', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		fromCustomerId: DataTypes.CHAR(64),
		toCustomerId: DataTypes.CHAR(64),
		name: DataTypes.CHAR(),
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}customer_relation`
	});
};
