const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherManagerFileRouter(router, {
	Resource, Sequelize
}) {
	const Customer = Sequelize.model('Customer');
	const Account = Sequelize.model('Account');
	const AccountData = Sequelize.model('AccountData');
	const Plan = Sequelize.model('Plan');
	const AccountProductData = Sequelize.model('AccountProductData');

	router.get('/', async function hello(ctx) {
		const { manager } = ctx.state;
		const { dateAs } = ctx.query;

		const customerList = await Customer.findAll({
			where: { managerId: manager.id },
			include: [{
				model: Account,
				include: [{
					model: AccountData,
					include: [
						{
							model: Plan,
							where: { dateAs }
						},
						{
							model: AccountProductData,
						}
					],
					required: false
				}],
			}]
		});

		ctx.body = customerList.map(customer => {
			const { Accounts: accountList } = customer;

			const resource = {
				id: customer.id,
				name: customer.name,
				gender: customer.gender,
				identificationCode: customer.identificationCode,
				mobilePhone: customer.mobilePhone,
				managerId: customer.managerId,
				data: {},
				dateAs: null
			};

			accountList.forEach(account => {
				const { AccountData: dataList } = account;
				const data = dataList[0];

				if (data) {
					const productDataList = data.AccountProductData;

					productDataList.forEach(productData => {
						if (!resource.data[productData.productCode]) {
							resource.data[productData.productCode] = {
								averageDeposit: 0,
								balance: 0
							};
						}

						const { averageDeposit, balance } = productData;

						resource.data[productData.productCode].averageDeposit += averageDeposit;
						resource.data[productData.productCode].balance += balance;
					});

					resource.dateAs = data.AccountDataPlan.dateAs;
				}
			});

			return resource;
		});
	});
});
