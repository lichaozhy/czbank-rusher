const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankManagerProfile(router, {
	Model, AccessControl: $AC
}) {
	function Manager(manager) {
		return {
			id: manager.id,
			name: manager.name,
			code: manager.code
		};
	}

	function Performance(data) {
		const { ManagerContribution: contribution, File: file } = data;
		const { Plan: plan } = file;

		return {
			id: data.id,
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

	router.get('/', $AC('manager.get'), async ctx => {
		const { managerId } = ctx.session;
		const manager = await Model.Manager.findOne({ where: { id: managerId } });

		ctx.body = Manager(manager);
	}).get('/performance', $AC('manager.get'), async ctx => {
		const { managerId } = ctx.session;

		const list = await Model.ManagerData.findAll({
			where: { managerId },
			include: [
				{ model: Model.ManagerContribution },
				{ model: Model.File, include: [{ model: Model.Plan }] }
			]
		});

		ctx.body = list.map(data => Performance(data));
	});
});
