module.exports = function ManagerPreview(manager) {
	const { ManagerData } = manager;

	const preview = {
		manager: { id: manager.id, name: manager.name, code: manager.code },
		contribution: {
			deposit: { balance: null, average: null },
			other: { balance: null, average: null },
			average: null,
			balance: null,
			rate: null,
			value: null
		},
		customerNumber: null,
		lastDateAs: null
	};

	if (ManagerData.length > 0) {
		ManagerData.sort((managerDataA, managerDataB) => {
			return managerDataA.File.Plan.dateAs - managerDataB.File.Plan.dateAs;
		});

		const { ManagerContribution: c, File } = ManagerData[0];

		preview.contribution.deposit.balance = c.depositBalance;
		preview.contribution.deposit.average = c.depositAverage;
		preview.contribution.other.balance = c.otherBalance;
		preview.contribution.other.average = c.otherAverage;
		preview.contribution.average = c.average;
		preview.contribution.balance = c.balance;
		preview.contribution.rate = c.rate;
		preview.contribution.value = c.contribution;

		preview.customerNumber = File.customerNumber;
		preview.lastDateAs = File.Plan.dateAs;
	}

	return preview;
};
