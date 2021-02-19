module.exports = function PointAdjustment(data) {
	const adjustment = data;
	const { Customer: customer } = adjustment;

	return {
		id: adjustment.id,
		customer: {
			id: customer.id,
			name: customer.name,
			code: customer.identificationCode
		},
		value: adjustment.value,
		type: adjustment.typeCode,
		createdAt: adjustment.createdAt
	};
};
