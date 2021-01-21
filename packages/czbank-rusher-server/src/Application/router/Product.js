const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherAPIRouter(router, {
	Sequelize, Utils
}) {
	const Product = Sequelize.model('Product');

	const Resource = {
		Product(productData) {
			return {
				id: productData.id,
				name: productData.name,
				code: productData.code,
				description: productData.description
			};
		}
	};

	router.get('/', async function getProductList(ctx) {
		const list = await Product.findAll();

		ctx.body = list.map(product => Resource.Product(product));
	}).post('/', async function createProduct(ctx) {
		const { name, code, description } = ctx.request.body;
		const product = Product.create({
			id: Utils.encodeSHA256(`${name}${code}${Date.now()}`),
			name, code, description
		});

		ctx.body = Resource.Product(product);
	}).param('productId', async function queryProduct(id, ctx, next) {
		const product = await Product.findOne({ where: { id } });

		if (!product) {
			return ctx.throw(404, 'The product is NOT existed.');
		}

		return next();
	}).get('/:productId', async function getProduct(ctx) {
		const { product } = ctx.state;

		ctx.body = Resource.Product(product);
	}).put('/:productId', async function updateProduct(ctx) {
		const { product } = ctx.state;
		const { name, code, description } = ctx.request.body;

		if (name) {
			product.name = name;
		}

		if (code) {
			product.code = code;
		}

		if (description) {
			product.description = description;
		}

		await product.save();

		ctx.body = Resource.Product(product);
	}).delete('/:productId', async function deleteProduct(ctx) {
		const { product } = ctx.state;

		await product.destroy();

		ctx.body = Resource.Product(product);
	});
});
