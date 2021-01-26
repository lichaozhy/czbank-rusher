const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherAPIRouter(router, {
	Sequelize, Utils, Resource
}) {
	const Product = Sequelize.model('Product');
	const ProductAccountDataSetting = Sequelize.model('ProductAccountDataSetting');

	router.get('/', async function getProductList(ctx) {
		const list = await Product.findAll({
			include: [ProductAccountDataSetting]
		});

		ctx.body = list.map(product => {
			return Resource.Product(product, product.ProductAccountDataSetting);
		});
	}).post('/', async function createProduct(ctx) {
		const { name, code, description } = ctx.request.body;
		const id = Utils.encodeSHA256(`${name}${code}${Date.now()}`);
		const product = await Product.create({ id, name, code, description });
		const setting = await ProductAccountDataSetting.create({ productId: id });

		ctx.body = Resource.Product(product, setting);
	}).param('productId', async function queryProduct(id, ctx, next) {
		const product = await Product.findOne({
			where: { id },
			include: [ProductAccountDataSetting]
		});

		if (!product) {
			return ctx.throw(404, 'The product is NOT existed.');
		}

		ctx.state.product = product;
		ctx.state.setting = product.ProductAccountDataSetting;

		return next();
	}).get('/:productId', async function getProduct(ctx) {
		const { product, setting } = ctx.state;

		ctx.body = Resource.Product(product, setting);
	}).put('/:productId', async function updateProduct(ctx) {
		const { product, setting } = ctx.state;
		const { name, code, description, fieldIndex } = ctx.request.body;

		if (name) {
			product.name = name;
		}

		if (code) {
			product.code = code;
		}

		if (description) {
			product.description = description;
		}

		if (fieldIndex) {
			const { averageDeposit, balance } = fieldIndex;

			setting.fieldIndexOfAverageDeposit = averageDeposit;
			setting.fieldIndexOfBalance = balance;
			setting.save();
		}

		product.save();

		ctx.body = Resource.Product(product, setting);
	}).delete('/:productId', async function deleteProduct(ctx) {
		const { product, setting } = ctx.state;

		product.destroy();
		product.ProductAccountDataSetting.destroy();

		ctx.body = Resource.Product(product, setting);
	});
});
