const crypto = require('crypto');
const REG_MD5 = /[0-9a-z]{32}/i;
const DEPOSIT_PRODUCT_CODE = 'DEPOSIT';

module.exports = {
	// encodeMD5(raw) {
	// 	const md5 = crypto.createHash('md5');

	// 	md5.update(raw);

	// 	return md5.digest().toString('hex');
	// },
	encodeSHA256(raw) {
		const md5 = crypto.createHash('sha256');

		md5.update(raw);

		return md5.digest().toString('hex');
	},
	randomInt(from, to) {
		return Math.round(Math.random() * (to - from) + from);
	},
	Contribution(data) {
		const matrix = {
			deposit: { average: null, balance: null },
			other: { average: null, balance: null },
			average: null,
			balance: null,
			rate: null,
			contribution: null
		};

		if (data) {
			matrix.deposit.balance = data[DEPOSIT_PRODUCT_CODE].balance;
			matrix.deposit.average = data[DEPOSIT_PRODUCT_CODE].average;

			matrix.balance = 0;
			matrix.average = 0;

			for(const productCode in data) {
				matrix.balance += data[productCode].balance;
				matrix.average += data[productCode].average;
			}

			matrix.other.balance = matrix.balance - matrix.deposit.balance;
			matrix.other.average = matrix.average - matrix.deposit.average;
			matrix.rate = matrix.average ? matrix.deposit.average / matrix.average : null;
			matrix.contribution = (matrix.deposit.average * 2 + matrix.other.average) / 10000;
		}

		return {
			depositBalance: matrix.deposit.balance,
			depositAverage: matrix.deposit.average,
			otherBalance: matrix.other.balance,
			otherAverage: matrix.other.average,
			rate: matrix.rate,
			balance: matrix.balance,
			average: matrix.average,
			contribution: Math.round(matrix.contribution)
		};
	},
	// LocalDateString(date) {
	// 	return dateformat(date, 'yyyy-mm-dd HH:MM:ss');
	// }
};
