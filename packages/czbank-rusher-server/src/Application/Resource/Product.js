module.exports = function Product(product, setting) {
	return {
		id: product.id,
		name: product.name,
		code: product.code,
		description: product.description,
		fieldIndex: {
			averageDeposit: setting.fieldIndexOfAverageDeposit,
			balance: setting.fieldIndexOfBalance
		}
	};
};
