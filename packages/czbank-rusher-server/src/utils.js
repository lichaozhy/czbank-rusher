const crypto = require('crypto');
const REG_MD5 = /[0-9a-z]{32}/i;

module.exports = {
	// encodeMD5(raw) {
	// 	const md5 = crypto.createHash('md5');

	// 	md5.update(raw);

	// 	return md5.digest().toString('hex');
	// },
	encodeSHA256(raw) {
		const md5 = crypto.createHash('sha256');

		md5.update(raw);

		return md5.digest().toString('hex');
	},
	randomInt(from, to) {
		return Math.round(Math.random() * (to - from) + from);
	},

	// LocalDateString(date) {
	// 	return dateformat(date, 'yyyy-mm-dd HH:MM:ss');
	// }
};
