const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function CustomerRelation(sequelize, namespace) {
	sequelize.define('CustomerRelation', {
		id: {
			type: DataTypes.CHAR(32),
			primaryKey: true
		},
		fromCustomerId: DataTypes.CHAR(32),
		toCustomerId: DataTypes.CHAR(32),
		name: DataTypes.CHAR(),
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}customer_relation`
	});
};
