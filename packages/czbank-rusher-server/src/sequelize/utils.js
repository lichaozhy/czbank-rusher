const BASIC_OPTIONS = {
	foreignKeyConstraint: false,
	constraints: false
};

exports.FK = function ForeignKeyOptions(foreignKey) {
	return Object.assign({ foreignKey }, BASIC_OPTIONS);
};
