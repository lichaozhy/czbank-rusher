import axios from 'axios';
import dateformat from 'dateformat';
import numeral from 'numeral';

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

const plugin = {
	install(Vue) {
		Vue.filter('localDatetime', localDatetime);
		Vue.filter('localDate', localDate);
		Vue.filter('localTime', localTime);
		Vue.filter('numeral', value => numeral(value).format('0,0'));
		Vue.filter('numeralFloat', value => numeral(value).format('0,0.00'));

		const agent = axios.create({ baseURL: '/api' });

		const backend = Object.assign(function IApi() {

		}, {
			Customer: Object.assign(function ICustomer(customerId) {
				return {
					get() {
						return agent.get(`/customer/${customerId}`).then(pickData);
					},
					Performance: {
						query() {
							return agent.get(`/customer/${customerId}/performance`).then(pickData);
						}
					}
				};
			}, {
				query(options) {
					return agent.get('/customer', {
						params: { name: options.name }
					}).then(pickData);
				}
			}),
			Present: Object.assign(function IPresent(presentId) {
				return {
					get() {
						return agent.get(`/present/${presentId}`).then(pickData);
					}
				};
			}, {
				query() {
					return agent.get('/present').then(pickData);
				},
				exchange(options) {
					return agent.post('/present/exchange', {
						customerId: options.customerId,
						presentId: options.presentId,
						amount: options.amount,
						description: options.description
					}).then(pickData);
				}
			}),
			Activity: Object.assign(function IActivity(activityId) {
				return {
					get() {
						return agent.get(`/activity/${activityId}`).then(pickData);
					}
				};
			}, {
				query() {
					return agent.get('/activity').then(pickData);
				},
				reward(options) {
					return agent.post('/present/exchange', {
						customerId: options.customerId,
						activityId: options.activityId,
						point: options.point
					}).then(pickData);
				}
			}),
			Manager: {
				get() {
					return agent.get('/manager').then(pickData);
				}
			},
			Principal: {
				delete() {
					return agent.delete('/principal').then(pickData);
				}
			}
		});

		Vue.prototype.$manager = {
			backend
		};

		plugin.backend = backend;
	},
	backend: null
};

export default plugin;
