const fs = require('fs');
const path = require('path');
const ReportResolver = require('../packages/czbank-rusher-server/src/ReportResolver');
const productList = require('./product');

const file = fs.readFileSync(path.join(__dirname, 'sample.xls'));
const resolve = ReportResolver(productList);
const report = resolve(file);

console.log(report.Result);
