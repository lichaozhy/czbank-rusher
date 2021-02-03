module.exports = function Product(productData) {
	const {
		fieldIndexOfBalance,
		fieldIndexOfAverage
	} = productData.ProductAccountDataSetting;

	return {
		id: productData.id,
		name: productData.name,
		code: productData.code,
		description: productData.description,
		fieldIndex: {
			average: fieldIndexOfAverage,
			balance: fieldIndexOfBalance
		}
	};
};
