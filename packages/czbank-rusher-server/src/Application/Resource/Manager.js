module.exports = function Manager(manager, customerList, fileList) {
	fileList.slice(0).sort((fileA, fileB) => {
		return fileA.AccountDataPlan.dateAs - fileB.AccountDataPlan.dateAs;
	});

	const file = fileList[0];

	return {
		id: manager.id,
		name: manager.name,
		code: manager.code,
		customerNumber: customerList.length,
		lastUploadedDateAs: file ? file.AccountDataPlan.dateAs : null
	};
};
