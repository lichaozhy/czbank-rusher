const { Router } = require('@produck/duck-web-koa-router');
const fs = require('fs-extra');

module.exports = Router(function CZBankRusherAccountDataFileRouter(router, {
	Sequelize, Utils, Workspace, AccountDataResolver
}) {
	const Customer = Sequelize.model('Customer');
	const Account = Sequelize.model('Account');
	const AccountData = Sequelize.model('AccountData');
	const AccountProductData = Sequelize.model('AccountProductData');
	const AccountDataFile = Sequelize.model('AccountDataFile');
	const Manager = Sequelize.model('Manager');
	const AccountDataPlan = Sequelize.model('AccountDataPlan');

	const Resource = {
		AccountDataFile(data) {
			const { Manager, AccountDataPlan } = data;

			return {
				id: data.id,
				plan: {
					id: AccountDataPlan.id,
					name: AccountDataPlan.name
				},
				manager: {
					id: Manager.id,
					name: Manager.name
				}
			};
		}
	};

	async function saveData(resolved, managerId, planId) {
		const { date, result } = resolved;
		const { accountMap, customerMap, dataList } = result;

		for(const accountId in accountMap) {
			const account = accountMap[accountId];

			await Account.findOrCreate({
				where: { id: accountId },
				defaults: {
					id: accountId,
					customerId: account.customerId,
					internalCode: account.internalCode,
					assetTotal: 0
				}
			});
		}

		for(const customerId in customerMap) {
			const customer = customerMap[customerId];

			await Customer.findOrCreate({
				where: { id: customerId },
				defaults: {
					id: customerId,
					managerId: managerId,
					name: customer.name,
					identificationCode: customer.desensitizedIDCardNumber,
					assetTotal: 0
				}
			});
		}

		let now = Date.now();

		for(const accountData of dataList) {
			const { accountId, data: productDataMap } = accountData;
			const id = Utils.encodeSHA256(`${planId}${accountId}${now++}`);

			await AccountData.create({
				id: id,
				planId: planId,
				accountId: accountId
			});

			for(const productCode in productDataMap) {
				const productData = productDataMap[productCode];

				await AccountProductData.create({
					dataId: id,
					productCode: productCode,
					averageDeposit: productData.averageDeposit,
					balance: productData.balance
				});
			}
		}

		console.log('写完了');
	}

	router.get('/', async function getFileList(ctx) {
		const { planId, managerId } = ctx.query;
		const options = { where: {} };

		if (planId) {
			options.where.planId = planId;
		}

		if (managerId) {
			options.where.managerId = managerId;
		}

		const list = await AccountDataFile.findAll(options);

		ctx.body = list.map(fileData => Resource.AccountDataFile(fileData));
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

		const existed = await AccountDataFile.findOne({ where: { managerId, planId } });

		if (existed) {
			await fs.remove(raw.path);

			return ctx.throw(400, 'The manager has uploaded file to the plan.');
		}

		const xlsFile = await fs.readFile(raw.path);
		const id = Utils.encodeSHA256(xlsFile);

		await fs.move(raw.path, Workspace.resolve('file', `${id}.xls`));

		const file = await AccountDataFile.create({
			id, planId, managerId, description,
			createdAt: new Date()
		});

		const setting = JSON.parse(plan.setting).map(item => {
			return {
				name: item.name,
				code: item.code,
				balanceIndex: item.balance,
				averageDepositIndex: item.averageDeposit
			};
		});

		const resolver = AccountDataResolver(setting);

		saveData(resolver(xlsFile), managerId);
		file.Manager = manager;
		file.AccountDataPlan = plan;
		ctx.body = Resource.AccountDataFile(file);
	}).get('/:fileId', async function getFile() {

	}).get('/:filedId.xls', async function downloadXLS() {

	}).delete('/:fileId', async function deleteFile() {

	});
});
