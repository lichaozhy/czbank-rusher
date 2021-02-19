module.exports = function PresentExchange(data) {
	const exchange = data;
	const { CustomerPointAdjustment: adjustment, Activity: activity } = exchange;
	const { Customer: customer } = adjustment;

	return {
		id: adjustment.id,
		activity: {
			id: activity.id,
			name: activity.name
		},
		customer: {
			id: customer.id,
			name: customer.name
		},
		point: exchange.point,
		description: exchange.description,
		createdAt: exchange.createdAt
	};
};
