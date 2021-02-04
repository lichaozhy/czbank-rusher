module.exports = function CustomerPerformance(contribution) {
	const {
		Customer: customer,
		Manager: manager
	} = contribution.CustomerDatum;

	return {
		customer: {
			id: customer.id,
			name: customer.name
		},
		manager: {
			id: manager.id,
			name: manager.name
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
