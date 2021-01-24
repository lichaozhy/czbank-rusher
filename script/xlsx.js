const fs = require('fs');
const path = require('path');
const CZBankAccountDataFileReader = require('../packages/czbank-rusher-server/src/xlsx');
const productList = require('./product');

const file = fs.readFileSync(path.join(__dirname, 'sample2.xls'));
const resolve = CZBankAccountDataFileReader(productList);

resolve(file);
