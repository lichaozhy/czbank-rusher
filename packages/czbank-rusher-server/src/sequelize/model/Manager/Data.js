const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function ManagerData(sequelize, namespace) {
	sequelize.define('ManagerData', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		managerId: DataTypes.CHAR(64),
		fileId: DataTypes.CHAR(64)
	}, {
		tableName: `${namespace}manager_data`
	});
};
