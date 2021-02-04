module.exports = function CustomerPerformance(customerData) {
	const {
		Customer: customer,
		CustomerContribution: contribution
	} = customerData;

	return {
		customer: {
			id: customer.id,
			name: customer.name
		},
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
