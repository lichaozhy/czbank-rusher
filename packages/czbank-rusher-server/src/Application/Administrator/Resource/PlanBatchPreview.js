module.exports = function PlanBatchPreview(data) {
	const { Customer: customer, CustomerContribution: contribution } = data;
	const { CustomerPoint: point } = customer;

	return {
		customer: {
			id: customer.id,
			name: customer.name
		},
		point: point.value,
		contribution: {
			deposit: {
				balance: contribution.depositBalance,
				average: contribution.depositAverage
			},
			other: {
				balance: contribution.otherBalance,
				average: contribution.otherAverage
			},
			average: contribution.average,
			balance: contribution.balance,
			rate: contribution.rate,
			value: contribution.contribution
		}
	};
};
