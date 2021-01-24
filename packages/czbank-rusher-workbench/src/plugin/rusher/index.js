import axios from 'axios';
import dateformat from 'dateformat';

export function localDatetime(value) {
	return dateformat(value, 'yyyy-mm-dd HH:MM:ss');
}

export function localDate(value) {
	return dateformat(value, 'yyyy-mm-dd');
}

export function localTime(value) {
	return dateformat(value, 'HH:MM:ss');
}


function pickData(res) {
	return res.data;
}

export default {
	install(Vue) {
		Vue.filter('localDatetime', localDatetime);
		Vue.filter('localDate', localDate);
		Vue.filter('localTime', localTime);

		const agent = axios.create({ baseURL: '/api' });

		const backend = Object.assign(function IApi() {

		}, {
			getProduct() {
				return agent.get('/').then(pickData);
			},
			Manager: Object.assign(function IManager(managerId) {
				return {
					delete() {
						return agent.delete(`/manager/${managerId}`).then(pickData);
					},
					get() {
						return agent.get(`/manager/${managerId}`).then(pickData);
					},
					update(options) {
						const { name, code } = options;

						return agent.put(`/manager/${managerId}`, {
							name,
							code
						}).then(pickData);
					}
				};
			}, {
				query() {
					return agent.get('/manager').then(pickData);
				},
				create(options) {
					const { name, code } = options;

					return agent.post('/manager', {
						name,
						code
					}).then(pickData);
				}
			}),
			Product: Object.assign(function IProduct(productId) {
				return {
					get() {
						return agent.get(`/product/${productId}`).then(pickData);
					},
					update(options) {
						const { name, code, description, fieldIndex } = options;

						return agent.put(`/product/${productId}`, {
							name, code, description, fieldIndex
						}).then(pickData);
					},
					delete() {
						return agent.delete(`/product/${productId}`).then(pickData);
					}
				};
			}, {
				query() {
					return agent.get('/product').then(pickData);
				},
				create(options) {
					const { name, code, description } = options;

					return agent.post('/product', {
						name, code, description
					}).then(pickData);
				}
			}),
			File: Object.assign(function IAccountDataFile() {

			}, {
				create(options) {
					const { planId, managerId, raw } = options;
					const formdata = new FormData();

					formdata.append('planId', planId);
					formdata.append('managerId', managerId);
					formdata.append('raw', raw);

					return agent.post('/account/data/file', formdata).then(pickData);
				}
			}),
			AccountDataPlan: Object.assign(function IAccountDataPlan(planId) {
				return {
					get() {
						return agent.get(`/account/data/plan/${planId}`).then(pickData);
					},
					update(options) {
						const { name, description } = options;

						return agent.put(`/account/data/plan/${planId}`, {
							name, description
						}).then(pickData);
					},
					delete() {
						return agent.delete(`/account/data/plan/${planId}`).then(pickData);
					},
					resolve() {
						return agent.post(`/account/data/plan/${planId}/result`, {}).then(pickData);
					}
				};
			}, {
				query() {
					return agent.get('/account/data/plan').then(pickData);
				},
				create(options) {
					const { name, description, dateAs } = options;

					return agent.post('/account/data/plan', {
						name, dateAs, description
					}).then(pickData);
				}
			})
		});

		Vue.prototype.$rusher = {
			backend
		};
	}
};
