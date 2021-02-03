module.exports = function ManagerPerformance(managerData) {
	const { Manager: manager, ManagerProductData } = managerData;

	const managerPerformance = {
		id: manager.id,
		name: manager.name,
		code: manager.code,
		productDataMap: {}
	};

	ManagerProductData.forEach(productData => {
		managerPerformance.productDataMap[productData.productCode] = {
			average: productData.average,
			balance: productData.balance
		};
	});

	return managerPerformance;
};
