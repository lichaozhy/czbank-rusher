const fs = require('fs');
const path = require('path');
const CZBankAccountDataFileReader = require('../packages/czbank-rusher-server/src/xlsx');

const file = fs.readFileSync(path.join(__dirname, 'sample.xls'));

const resolve = CZBankAccountDataFileReader([
	{
		name: '增金宝',
		code: 'ZENG_JIN_BAO',
		balanceIndex: 'G',
		averageDespositIndex: 'H'
	},
	{
		name: '个人存款',
		code: 'DEPOSIT',
		balanceIndex: 'E',
		averageDespositIndex: 'F'
	},
	{
		name: '理财产品',
		code: 'FINANCIAL_PRODUCT',
		balanceIndex: 'I',
		averageDespositIndex: 'K'
	},
	{
		name: '涌金钱包',
		code: 'YONG_JIN_WALLET',
		balanceIndex: 'L',
		averageDespositIndex: 'N'
	},
	{
		name: '小微钱铺',
		code: 'MICRO_BANK',
		balanceIndex: 'O',
		averageDespositIndex: 'Q'
	},
	{
		name: '基金',
		code: 'FUND',
		balanceIndex: 'R',
		averageDespositIndex: 'T'
	},
	{
		name: '信托产品',
		code: 'TRUST_PRODUCT',
		balanceIndex: 'U',
		averageDespositIndex: 'W'
	},
	{
		name: '资管计划产品',
		code: 'ASSET_MANAGEMENT_PLAN_PRODUCT',
		balanceIndex: 'X',
		averageDespositIndex: 'Z'
	},
	{
		name: '保险',
		code: 'INSURANCE',
		balanceIndex: 'AA',
		averageDespositIndex: 'AB'
	},
	{
		name: '国债',
		code: 'NATIONAL_DEBT',
		balanceIndex: 'AC',
		averageDespositIndex: 'AD'
	}
]);

resolve(file);
