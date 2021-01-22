const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherAPIRouter(router, {
	Sequelize, Utils
}) {
	const Product = Sequelize.model('Product');
	const ProductAccountDataSetting = Sequelize.model('ProductAccountDataSetting');

	const Resource = {
		Product(productData) {
			const {
				fieldIndexOfAverageDeposit,
				fieldIndexOfBalance
			} = productData.ProductAccountDataSetting;

			return {
				id: productData.id,
				name: productData.name,
				code: productData.code,
				description: productData.description,
				fieldIndex: {
					averageDeposit: fieldIndexOfAverageDeposit,
					balance: fieldIndexOfBalance
				}
			};
		}
	};

	router.get('/', async function getProductList(ctx) {
		const list = await Product.findAll({
			include: [ProductAccountDataSetting]
		});

		ctx.body = list.map(product => Resource.Product(product));
	}).post('/', async function createProduct(ctx) {
		const { name, code, description } = ctx.request.body;
		const id = Utils.encodeSHA256(`${name}${code}${Date.now()}`);
		const product = await Product.create({ id, name, code, description });

		product.ProductAccountDataSetting = await ProductAccountDataSetting.create({ productId: id });

		ctx.body = Resource.Product(product);
	}).param('productId', async function queryProduct(id, ctx, next) {
		const product = await Product.findOne({
			where: { id },
			include: [ProductAccountDataSetting]
		});

		if (!product) {
			return ctx.throw(404, 'The product is NOT existed.');
		}

		ctx.state.product = product;

		return next();
	}).get('/:productId', async function getProduct(ctx) {
		const { product } = ctx.state;

		ctx.body = Resource.Product(product);
	}).put('/:productId', async function updateProduct(ctx) {
		const { product } = ctx.state;
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

			product.ProductAccountDataSetting.fieldIndexOfAverageDeposit = averageDeposit;
			product.ProductAccountDataSetting.fieldIndexOfBalance = balance;
			product.ProductAccountDataSetting.save();
		}

		product.save();

		ctx.body = Resource.Product(product);
	}).delete('/:productId', async function deleteProduct(ctx) {
		const { product } = ctx.state;

		product.destroy();
		product.ProductAccountDataSetting.destroy();

		ctx.body = Resource.Product(product);
	});
});
