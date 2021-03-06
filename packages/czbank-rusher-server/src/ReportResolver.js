const XLSX = require('xlsx');
const crypto = require('crypto');

const DATA_START_ROW = 7;
const PAGINATION_STINRG = '账户号';
const ROW_SAFE_LIMITATION = 100000;
const IGNORE_NAME_REG = /资产池保证金/;

function toNumber(string) {
	return Number(string.replace(/,/g, ''));
}

function getDataSheet(workbook) {
	return workbook.Sheets[workbook.SheetNames[0]];
}

function getDate(sheet) {
	const raw = String(sheet.B2.v);

	return `${raw.substr(0, 4)}-${raw.substr(4, 2)}-${raw.substr(6, 2)}`;
}

function encodeSHA256(raw) {
	const md5 = crypto.createHash('sha256');

	md5.update(raw);

	return md5.digest().toString('hex');
}

function CustomerId(name, desensitizedIDCardNumber) {
	return encodeSHA256(`${name}${desensitizedIDCardNumber}`);
}

function AccountId(internalCode, name) {
	return encodeSHA256(`${internalCode}${name}`);
}

function Id(internalCode, name) {
	return `${internalCode}-${name}`;
}

function normalize(_options = []) {
	const options = [];

	if (!Array.isArray(_options)) {
		throw new TypeError('An array MUST be provided.');
	}

	_options.forEach(_product => {
		const product = {};

		const {
			name: _name,
			code: _code,
			balanceIndex: _balanceIndex,
			averageIndex: _averageIndex
		} = _product;

		product.name = _name;
		product.code = _code;
		product.balanceIndex = _balanceIndex;
		product.averageIndex = _averageIndex;

		options.push(product);
	});

	return options;
}

module.exports = function CZBankReportFileReader(options = []) {
	const Product = normalize(options);

	function Abstract() {
		const abstract = {};

		Product.forEach(product => abstract[product.code] = { average: 0, balance: 0 });

		return abstract;
	}

	return function read(buffer) {
		const abstract = Abstract();
		const workbook = XLSX.read(buffer);
		const sheet = getDataSheet(workbook);
		const date = getDate(sheet);
		const Result = {
			customerMap: {},
			accountMap: {},
			dataList: []
		};

		const state = {
			row: DATA_START_ROW,
			afterPagination: false,
			lostRowList: [],
			idMap: {},
			resolved: false
		};

		function ProductData(row) {
			const data = {};

			Product.forEach(product => {
				data[product.code] = {
					name: product.name,
					balance: toNumber(sheet[`${product.balanceIndex}${row}`].w),
					average: toNumber(sheet[`${product.averageIndex}${row}`].w)
				};
			});

			return data;
		}

		function resolve() {
			if (state.resolved) {
				return;
			}

			/**
			 * Main handling
			 */
			while (state.row < ROW_SAFE_LIMITATION) {
				const { row } = state;
				const Ax = sheet[`A${row}`];
				const Bx = sheet[`B${row}`];
				const Cx = sheet[`C${row}`];

				if (Ax === undefined) {
					break;
				}

				if (Ax.v === PAGINATION_STINRG) {
					state.row += 2;
					continue;
				}

				if (Cx.w.trim().length === 16 || IGNORE_NAME_REG.test(Bx.w)) {
					state.row += 1;
					continue;
				}

				const internalCode = Ax.w;
				const name = Bx.w;
				const desensitizedIDCardNumber = Cx.w;

				if (!desensitizedIDCardNumber) {
					/**
					 * Lost row occurred.
					 */
					state.lostRowList.push({ number: row, id: Id(internalCode, name) });
					state.row += 1;
					continue;
				}

				const accountId = AccountId(internalCode);
				const customerId = CustomerId(name, desensitizedIDCardNumber);
				const productData = ProductData(row);

				if (!Result.accountMap[accountId]) {
					Result.accountMap[accountId] = { accountId, customerId, internalCode };
				}

				if (!Result.customerMap[customerId]) {
					Result.customerMap[customerId] = { customerId, name, desensitizedIDCardNumber };
				}

				Result.dataList.push({ accountId, customerId, data: productData });

				state.idMap[Id(internalCode, name)] = { accountId, desensitizedIDCardNumber };
				state.row += 1;
			}

			/**
			 * For lost row.
			 */
			state.lostRowList.forEach(row => {
				const { accountId } = state.idMap[row.id];
				const productData = ProductData(row.number);

				const accountData = Result.dataList.find(accountData => {
					return accountData.accountId === accountId;
				});

				Object.keys(productData).forEach(code => {
					accountData.data[code].balance += productData[code].balance;
					accountData.data[code].average += productData[code].average;
				});
			});

			Result.dataList.forEach(accountData => {
				const { data } = accountData;

				for(const productCode in data) {
					const { balance, average } = data[productCode];

					abstract[productCode].balance += balance;
					abstract[productCode].average += average;
				}
			});

			state.resolved = true;
		}

		return {
			date,
			get Result() {
				const namespace = {
					Account: { list: [], dataList: [] },
					Customer: { list: [], dataList: [] },
					Abstract: Abstract()
				};

				resolve();

				const customerDataMap = {};

				for(const accountId in Result.accountMap) {
					const account = Object.assign({}, Result.accountMap[accountId]);

					namespace.Account.list.push(account);
				}

				for(const customerId in Result.customerMap) {
					const customer = Object.assign({}, Result.customerMap[customerId]);

					namespace.Customer.list.push(customer);
					customerDataMap[customerId] = Abstract();
				}

				Result.dataList.forEach(accountData => {
					const { data, customerId } = accountData;
					const customerAbstract = customerDataMap[customerId];

					namespace.Account.dataList.push(accountData);

					for(const productCode in data) {
						const { balance, average } = data[productCode];

						namespace.Abstract[productCode].balance += balance;
						namespace.Abstract[productCode].average += average;
						customerAbstract[productCode].balance += balance;
						customerAbstract[productCode].average += average;
					}
				});

				for(const customerId in customerDataMap) {
					namespace.Customer.dataList.push({
						customerId,
						data: customerDataMap[customerId]
					});
				}

				return namespace;
			}
		};
	};
};
