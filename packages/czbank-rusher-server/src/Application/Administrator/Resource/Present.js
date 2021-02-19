module.exports = function Present(present) {
	return {
		id: present.id,
		name: present.name,
		price: present.price,
		point: present.point,
		usageCount: present.CustomerPointAdjustmentByPresents.length,
		description: present.description,
		enabled: present.enabled,
		createdAt: present.createdAt,
		updatedAt: present.updatedAt
	};
};
