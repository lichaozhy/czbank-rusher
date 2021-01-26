const { Router } = require('@produck/duck-web-koa-router');
const fs = require('fs-extra');

module.exports = Router(function CZBankRusherAccountDataFileRouter(router, {
	Sequelize, Utils, Workspace, AccountDataResolver, Resource
}) {
	const Customer = Sequelize.model('Customer');
	const Account = Sequelize.model('Account');
	const AccountData = Sequelize.model('AccountData');
	const AccountProductData = Sequelize.model('AccountProductData');
	const AccountDataFile = Sequelize.model('AccountDataFile');
	const Manager = Sequelize.model('Manager');
	const AccountDataPlan = Sequelize.model('AccountDataPlan');

	async function saveData(resolved, managerId, planId, fileId) {
		const { result } = resolved;
		const { accountMap, customerMap, dataList } = result;

		await Account.bulkCreate(Object.keys(accountMap).map(accountId => {
			const account = accountMap[accountId];

			return {
				id: accountId,
				customerId: account.customerId,
				internalCode: account.internalCode,
				assetTotal: 0
			};
		}), {
			ignoreDuplicates: true
		});

		await Customer.bulkCreate(Object.keys(customerMap).map(customerId => {
			const customer = customerMap[customerId];

			return {
				id: customerId,
				managerId: managerId,
				name: customer.name,
				identificationCode: customer.desensitizedIDCardNumber,
				assetTotal: 0
			};
		}), {
			ignoreDuplicates: true
		});

		const now = Date.now();

		const accountDataList = [];
		const accountProductDataList = [];

		dataList.forEach((accountData, index) => {
			const { accountId, data: productDataMap } = accountData;
			const dataId = Utils.encodeSHA256(`${planId}${accountId}${now + index}`);

			accountDataList.push({
				id: dataId,
				planId: planId,
				accountId: accountId,
				fileId: fileId
			});

			Object.keys(productDataMap).forEach(productCode => {
				const productData = productDataMap[productCode];
				const { averageDeposit, balance } = productData;

				if (averageDeposit === 0 && balance === 0) {
					return;
				}

				accountProductDataList.push({
					dataId: dataId,
					productCode: productCode,
					averageDeposit: averageDeposit,
					balance: balance
				});
			});
		});

		await AccountData.bulkCreate(accountDataList, { ignoreDuplicates: true });
		await AccountProductData.bulkCreate(accountProductDataList, { ignoreDuplicates: true });

		console.log('写完了');
	}

	router.get('/', async function getFileList(ctx) {
		const { planId, managerId } = ctx.query;
		const options = { where: {}, include: [Manager, AccountDataPlan] };

		if (planId) {
			options.where.planId = planId;
		}

		if (managerId) {
			options.where.managerId = managerId;
		}

		const list = await AccountDataFile.findAll(options);

		ctx.body = list.map(file => {
			return Resource.AccountDataFile(file, file.Manager, file.AccountDataPlan);
		});
	}).post('/', async function importFile(ctx) {
		const { managerId, planId, description } = ctx.request.body;
		const { raw } = ctx.request.files;

		const manager = await Manager.findOne({ where: { id: managerId } });

		if (!manager) {
			return ctx.throw(400, `The manager id:${managerId} is NOT found.`);
		}

		const plan = await AccountDataPlan.findOne({ where: { id: planId } });

		if (!plan) {
			return ctx.throw(400, `The plan id:${planId} is NOT found.`);
		}

		const existedFile = await AccountDataFile.findOne({ where: { managerId, planId } });

		if (existedFile) {
			await fs.remove(raw.path);

			return ctx.throw(400, 'The manager has uploaded file to the plan.');
		}

		const xlsFile = await fs.readFile(raw.path);
		const id = Utils.encodeSHA256(xlsFile);
		const xlsPath = Workspace.resolve('file', `${id}.xls`);

		try {
			await fs.move(raw.path, xlsPath);
		} catch (err) {
			console.log('Moving xls fail because a same file has been already existed.');
		}

		const setting = JSON.parse(plan.setting).map(item => {
			return {
				name: item.name,
				code: item.code,
				balanceIndex: item.balance,
				averageDepositIndex: item.averageDeposit
			};
		});

		let resolvedData = null;

		try {
			const resolver = AccountDataResolver(setting);

			resolvedData = resolver(xlsFile);

			if (resolvedData.date !== plan.dateAs) {
				fs.remove(xlsPath);

				return ctx.throw(400, 'The date of file is NOT matched to the plan.');
			}

			saveData(resolvedData, managerId, planId, id);
		} catch (err) {
			console.log(err);
			fs.remove(xlsPath);

			return ctx.throw(400, 'Bad xls file.');
		}

		const file = await AccountDataFile.create({
			id, planId, managerId, description,
			size: xlsFile.length,
			customerNumber: Object.keys(resolvedData.result.customerMap).length,
			accountNumber: Object.keys(resolvedData.result.accountMap).length,
			abstract: JSON.stringify(resolvedData.abstract),
			createdAt: new Date()
		});

		file.Manager = manager;
		file.AccountDataPlan = plan;
		ctx.body = Resource.AccountDataFile(file, manager, plan);
	}).param('fileId', async (id, ctx, next) => {
		const file = await AccountDataFile.findOne();

		return next();
	}).get('/:fileId', async function getFile() {

	}).get('/:filedId.xls', async function downloadXLS() {

	}).delete('/:fileId', async function deleteFile() {

	});
});
