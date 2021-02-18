module.exports = function PresentExchange(data) {
	const exchange = data;
	const { CustomerPointAdjustment: adjustment, Present: present } = exchange;
	const { Customer: customer } = adjustment;

	return {
		id: adjustment.id,
		present: {
			id: present.id,
			name: present.name,
			point: present.point,
			price: present.price
		},
		customer: {
			id: customer.id,
			name: customer.name
		},
		point: exchange.point,
		amount: data.amount,
		description: data.description,
		createdAt: exchange.createdAt
	};
};
