const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

module.exports = Router(function CZBankManagerCustomer(router, {
	Model, AccessControl: $AC
}) {
	function Customer(data) {
		return {
			id: data.id,
			name: data.name,
			code: data.identificationCode,
			gender: data.gender,
			mobilePhone: data.mobilePhone,
			point: data.CustomerPoint.value
		};
	}

	function Performance(data) {
		const {
			CustomerContribution: contribution,
			File: file
		} = data;

		const { Plan: plan } = file;

		return {
			id: data.id,
			customerId: data.customerId,
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
			dateAs: plan.dateAs
		};
	}

	router.get('/', $AC('customer.query'), async ctx => {
		const { managerId } = ctx.session;
		const { name } = ctx.query;

		const list = await Model.Customer.findAll({
			where: {
				name: { [Op.like]: `%${name}%` }
			},
			include: [
				Model.CustomerPoint,
				{ model: Model.CustomerData, where: { managerId }, required: true }
			]
		});

		ctx.body = list.map(data => Customer(data));
	}).param('customerId', async function fetchCustomer(id, ctx, next) {
		const { managerId } = ctx.session;
		const data = await Model.Customer.findOne({
			where: { id },
			include: [
				Model.CustomerPoint,
				{ model: Model.CustomerData, where: { managerId }, required: true }
			]
		});

		if (!data) {
			return ctx.throw(404);
		}

		ctx.state.customer = data;

		return next();
	}).get('/:customerId', $AC('customer.get'), async ctx => {
		ctx.body = Customer(ctx.state.customer);
	}).get('/:customerId/performance', $AC('performance.query'), async ctx => {
		const list = await Model.CustomerData.findAll({
			where: { customerId: ctx.state.customer.id },
			include: [
				Model.CustomerContribution,
				// Model.CustomerProductData,
				{ model: Model.File, include: Model.Plan }
			]
		});

		ctx.body = list.map(data => Performance(data));
	});
});
