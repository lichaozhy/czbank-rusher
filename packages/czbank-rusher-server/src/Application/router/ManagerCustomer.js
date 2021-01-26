const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherManagerFileRouter(router, {
	Resource, Sequelize
}) {
	const Customer = Sequelize.model('Customer');
	const Account = Sequelize.model('Account');
	const AccountData = Sequelize.model('AccountData');
	const AccountDataPlan = Sequelize.model('AccountDataPlan');
	const AccountProductData = Sequelize.model('AccountProductData');

	router.get('/', async function hello(ctx) {
		const { manager } = ctx.state;
		const customerList = await Customer.findAll({
			where: { managerId: manager.id },
			include: [{
				model: Account,
				include: [{
					model: AccountData,
					include: [
						{
							model: AccountDataPlan,
							sort: [['dateAs', 'DESC']],
						},
						AccountProductData
					]
				}]
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
						resource.data[productData.productCode] = {
							averageDeposit: productData.averageDeposit,
							balance: productData.balance
						};
					});

					resource.dateAs = data.AccountDataPlan.dateAs;
				}
			});

			return resource;
		});
	});
});
