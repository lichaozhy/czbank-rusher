import axios from 'axios';

function pickData(res) {
	return res.data;
}

export default {
	install(Vue) {
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
			})
		});

		Vue.prototype.$rusher = {
			backend
		};
	}
};
