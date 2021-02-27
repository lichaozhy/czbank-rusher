function Key() {
	return Math.random().toString(16).substr(2, 8);
}


function normalize(_options = {}) {
	const options = {
		timeout: 10 * 60 * 1000
	};

	const {
		timeout: _timeout = options.timeout
	} = _options;

	options.timeout = _timeout;

	return options;
}

module.exports = function TicketRegistry(options) {
	const finalOptions = normalize(options);
	const store = {};

	const observer = setInterval(() => {
		const now = Date.now();

		for (const key in store) {
			if (store[key].createdAt - now < 0) {
				delete store[key];
			}
		}
	}, 10000);

	return {
		get(key) {
			const ticket = store[key];

			if (!ticket) {
				return null;
			}

			delete store[key];

			return ticket.data;
		},
		request(data) {
			const key = Key();

			store[key] = { createdAt: Date.now() + finalOptions.timeout, data };

			return key;
		},
		destroy() {
			clearInterval(observer);
		}
	};
};
