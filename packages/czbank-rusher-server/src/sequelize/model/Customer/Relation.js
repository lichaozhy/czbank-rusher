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
		fromId: DataTypes.CHAR(64),
		toId: DataTypes.CHAR(64),
		name: DataTypes.CHAR(16),
		description: DataTypes.STRING
	}, {
		tableName: `${namespace}customer_relation`
	});
};
