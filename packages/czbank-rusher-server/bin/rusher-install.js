const PRODUCT_LIST = [
	{
		name: '增金宝',
		code: 'ZENG_JIN_BAO',
		balanceIndex: 'G',
		averageIndex: 'H'
	},
	{
		name: '个人存款',
		code: 'DEPOSIT',
		balanceIndex: 'E',
		averageIndex: 'F'
	},
	{
		name: '理财产品',
		code: 'FINANCIAL_PRODUCT',
		balanceIndex: 'I',
		averageIndex: 'K'
	},
	{
		name: '涌金钱包',
		code: 'YONG_JIN_WALLET',
		balanceIndex: 'L',
		averageIndex: 'N'
	},
	{
		name: '小微钱铺',
		code: 'MICRO_BANK',
		balanceIndex: 'O',
		averageIndex: 'Q'
	},
	{
		name: '基金',
		code: 'FUND',
		balanceIndex: 'R',
		averageIndex: 'T'
	},
	{
		name: '信托产品',
		code: 'TRUST_PRODUCT',
		balanceIndex: 'U',
		averageIndex: 'W'
	},
	{
		name: '资管计划产品',
		code: 'ASSET_MANAGEMENT_PLAN_PRODUCT',
		balanceIndex: 'X',
		averageIndex: 'Z'
	},
	{
		name: '保险',
		code: 'INSURANCE',
		balanceIndex: 'AA',
		averageIndex: 'AB'
	},
	{
		name: '国债',
		code: 'NATIONAL_DEBT',
		balanceIndex: 'AC',
		averageIndex: 'AD'
	}
];

const { program } = require('commander');
const CZBankRusher = require('../');
const utils = require('../src/utils');
const fs = require('fs').promises;
const path = require('path');

program
	.option('-c, --config', 'Config file path')
	.parse(process.argv);

(async function install() {
	await fs.rmdir(path.resolve('public'), { recursive: true });

	const rusher = CZBankRusher();
	const Product = rusher.sequelize.model('Product');
	const ProductDataSetting = rusher.sequelize.model('ProductDataSetting');

	await rusher.install();

	PRODUCT_LIST.forEach(options => {
		const { name, code, balanceIndex, averageIndex } = options;
		const id = utils.encodeSHA256(`${name}${code}${Date.now()}`);

		Product.create({ id, name, code, description: name });

		ProductDataSetting.create({
			productId: id,
			fieldIndexOfAverage: averageIndex,
			fieldIndexOfBalance: balanceIndex
		});
	});
}());
