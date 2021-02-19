module.exports = function CustomerPoint(data) {
	return {
		id: data.id,
		name: data.name,
		point: data.CustomerPoint.value
	};
};
