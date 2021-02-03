const CZBRusher = require('../packages/czbank-rusher-server');
const rusher = CZBRusher();
const productList = require('./product');
const utils = require('../packages/czbank-rusher-server/src/utils');

const Product = rusher.sequelize.model('Product');
const ProductDataSetting = rusher.sequelize.model('ProductDataSetting');

(async function install() {
	await rusher.install();

	productList.forEach(options => {
		const { name, code, balanceIndex, averageDepositIndex } = options;
		const id = utils.encodeSHA256(`${name}${code}${Date.now()}`);

		Product.create({
			id, name, code, description: name
		});

		ProductDataSetting.create({
			productId: id,
			fieldIndexOfAverageDeposit: averageDepositIndex,
			fieldIndexOfBalance: balanceIndex
		});
	});
}());
