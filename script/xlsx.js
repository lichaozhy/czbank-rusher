const fs = require('fs');
const path = require('path');
const CZBankAccountDataFileReader = require('../packages/czbank-rusher-server/src/AccountDataResolver');
const productList = require('./product');

const file = fs.readFileSync(path.join(__dirname, 'sample2.xls'));
const resolve = CZBankAccountDataFileReader(productList);

const result = resolve(file);

console.log(result);
