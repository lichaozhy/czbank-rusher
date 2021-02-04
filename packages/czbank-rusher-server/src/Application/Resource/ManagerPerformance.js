module.exports = function ManagerPerformance(managerData) {
	const {
		Manager: manager,
		File: file,
		ManagerContribution: contribution
	} = managerData;

	return {
		manager: {
			id: manager.id,
			name: manager.name,
			code: manager.code
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
		},
		customerNumber: file.CustomerData.length,
		dateAs: file.Plan.dateAs
	};
};
