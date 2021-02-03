const { Router } = require('@produck/duck-web-koa-router');
const fs = require('fs-extra');

const DEFAULT_SETTING = require('../../../../../script/product');
const BULK_CREATING_OPTIONS = { ignoreDuplicates: true };

module.exports = Router(function CZBankRusherAccountDataFileRouter(router, {
	Model, Utils, Workspace, ReportResolver, Resource
}) {
	async function saveData(report, { managerId, planId, fileId }) {
		const { Result } = report;
		const { Account, Customer, Abstract } = Result;
		const now = Date.now();

		await Model.Account.bulkCreate(Account.list.map(account => {
			return {
				id: account.accountId,
				customerId: account.customerId,
				internalCode: account.internalCode
			};
		}), BULK_CREATING_OPTIONS);

		await Model.Customer.bulkCreate(Customer.list.map(customer => {
			return {
				id: customer.customerId,
				managerId: managerId,
				name: customer.name,
				identificationCode: customer.desensitizedIDCardNumber,
			};
		}), BULK_CREATING_OPTIONS);

		const accountDataList = [];
		const accountProductDataList = [];

		Account.dataList.forEach((accountData, index) => {
			const { accountId, data: productDataMap } = accountData;
			const id = Utils.encodeSHA256(`${planId}${accountId}${now}-${index}`);

			accountDataList.push({ id, planId, accountId, fileId });

			Object.keys(productDataMap).forEach(productCode => {
				const productData = productDataMap[productCode];
				const { average, balance } = productData;

				if (average === 0 && balance === 0) {
					return;
				}

				accountProductDataList.push({ accountDataId: id, productCode, average, balance });
			});
		});

		await Model.AccountData.bulkCreate(accountDataList, BULK_CREATING_OPTIONS);
		await Model.AccountProductData.bulkCreate(accountProductDataList, BULK_CREATING_OPTIONS);

		const customerDataList = [];
		const customerProductDataList = [];
		const customerContributionList = [];

		Customer.dataList.forEach((customerData, index) => {
			const { customerId, data: productDataMap } = customerData;
			const id = Utils.encodeSHA256(`${planId}${customerId}${now}-${index}`);

			customerDataList.push({ id, planId, managerId, customerId, fileId });

			Object.keys(productDataMap).forEach(productCode => {
				const productData = productDataMap[productCode];
				const { average, balance } = productData;

				if (average === 0 && balance === 0) {
					return;
				}

				customerProductDataList.push({ customerDataId: id, productCode, average, balance });
			});

			const contribution = Utils.Contribution(productDataMap);

			contribution.customerDataId = id;
			customerContributionList.push(contribution);
		});

		await Model.CustomerData.bulkCreate(customerDataList, BULK_CREATING_OPTIONS);
		await Model.CustomerProductData.bulkCreate(customerProductDataList, BULK_CREATING_OPTIONS);
		await Model.CustomerContribution.bulkCreate(customerContributionList, BULK_CREATING_OPTIONS);

		const managerProductDataList = [];

		{
			const id = Utils.encodeSHA256(`${planId}${managerId}${now}`);

			Object.keys(Abstract).forEach(productCode => {
				const productData = Abstract[productCode];
				const { average, balance } = productData;

				if (average === 0 && balance === 0) {
					return;
				}

				managerProductDataList.push({ managerDataId: id, productCode, average, balance });
			});

			const contribution = Utils.Contribution(Abstract);

			await Model.ManagerData.create({ id, fileId, managerId });
			contribution.managerDataId = id;
			await Model.ManagerContribution.create(contribution);
		}

		await Model.ManagerProductData.bulkCreate(managerProductDataList);

		console.log('写完了');
	}

	router.get('/', async function getFileList(ctx) {
		const { planId, managerId } = ctx.query;
		const options = { where: {}, include: [Model.Manager, Model.Plan] };

		if (planId) {
			options.where.planId = planId;
		}

		if (managerId) {
			options.where.managerId = managerId;
		}

		const list = await Model.File.findAll(options);

		ctx.body = list.map(file => Resource.File(file));
	}).post('/', async function importFile(ctx) {
		const { managerId, planId, description } = ctx.request.body;
		const { raw } = ctx.request.files;

		const manager = await Model.Manager.findOne({ where: { id: managerId } });

		if (!manager) {
			return ctx.throw(400, `The manager id:${managerId} is NOT found.`);
		}

		const plan = await Model.Plan.findOne({ where: { id: planId } });

		if (!plan) {
			return ctx.throw(400, `The plan id:${planId} is NOT found.`);
		}

		const existedFile = await Model.File.findOne({ where: { managerId, planId } });

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

		// const setting = JSON.parse(plan.setting).map(item => {
		// 	return {
		// 		name: item.name,
		// 		code: item.code,
		// 		balanceIndex: item.balance,
		// 		averageIndex: item.average
		// 	};
		// });

		const fileOptions = {
			id, planId, managerId, description,
			size: 0,
			customerNumber: 0,
			accountNumber: 0,
			createdAt: new Date()
		};

		try {
			const report = ReportResolver(DEFAULT_SETTING)(xlsFile);

			if (report.date !== plan.dateAs) {
				fs.remove(xlsPath);

				return ctx.throw(400, 'The date of file is NOT matched to the plan.');
			}

			saveData(report, { managerId, planId, fileId: id });
			fileOptions.customerNumber = report.Result.Customer.list.length;
			fileOptions.accountNumber = report.Result.Account.list.length;
			fileOptions.size = xlsFile.length;
		} catch (err) {
			console.log(err);
			fs.remove(xlsPath);

			return ctx.throw(400, 'Bad xls file.');
		}

		await Model.File.create(fileOptions);

		const file = await Model.File.findOne({
			where: { id }, include: [Model.Manager, Model.Plan]
		});

		ctx.body = Resource.File(file);
	}).param('fileId', async (id, ctx, next) => {
		const file = await Model.File.findOne();

		return next();
	}).get('/:fileId', async function getFile() {

	}).get('/:filedId.xls', async function downloadXLS() {

	}).delete('/:fileId', async function deleteFile() {

	});
});
