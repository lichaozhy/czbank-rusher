const DEPOSIT_PRODUCT_CODE = 'DEPOSIT';

export default function Matrix(abstract) {
	const matrix = {
		deposit: { average: null, balance: null },
		nonDeposit: { average: null, balance: null },
		average: null,
		balance: null,
		depositRate: null,
		contribution: null
	};

	if (abstract) {
		matrix.deposit.balance = abstract[DEPOSIT_PRODUCT_CODE].balance;
		matrix.deposit.average = abstract[DEPOSIT_PRODUCT_CODE].average;

		matrix.balance = 0;
		matrix.average = 0;

		for(const productCode in abstract) {
			matrix.balance += abstract[productCode].balance;
			matrix.average += abstract[productCode].average;
		}

		matrix.nonDeposit.balance = matrix.balance - matrix.deposit.balance;
		matrix.nonDeposit.average = matrix.average - matrix.deposit.average;
		matrix.depositRate = matrix.deposit.average / matrix.average;
		matrix.contribution = (matrix.deposit.average * 2 + matrix.nonDeposit.average) / 10000;
	}

	return matrix;
}
