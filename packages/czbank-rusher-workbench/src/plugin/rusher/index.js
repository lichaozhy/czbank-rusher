import axios from 'axios';
import dateformat from 'dateformat';
import bytes from 'bytes';
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

function toBytes(size) {
	return bytes(size);
}

function pickData(res) {
	return res.data;
}

export default {
	install(Vue) {
		Vue.filter('localDatetime', localDatetime);
		Vue.filter('localDate', localDate);
		Vue.filter('localTime', localTime);
		Vue.filter('toBytes', toBytes);
		Vue.filter('numeral', value => numeral(value).format('0,0'));
		Vue.filter('numeralFloat', value => numeral(value).format('0,0.00'));

		const agent = axios.create({ baseURL: '/api' });

		const backend = Object.assign(function IApi() {

		}, {
			getProduct() {
				return agent.get('/').then(pickData);
			},
			Meta: {
				Manager: {
					get() {
						return agent.get('/meta/manager').then(pickData);
					}
				}
			},
			Ticket: {
				create(options) {
					return agent.post('/ticket', {
						managerId: options.managerId
					}).then(pickData);
				}
			},
			Customer: Object.assign(function ICustomer() {

			}, {
				Performance: {
					query({ dateAs, customerId }) {
						return agent.get('/customer/performance', {
							params: { dateAs, customerId }
						}).then(pickData);
					}
				}
			}),
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
					},
					Customer: Object.assign(function IManagerCustomer() {

					}, {
						Performance: {
							query({ dateAs }) {
								return agent.get(`/manager/${managerId}/customer/performance`, {
									params: { dateAs }
								}).then(pickData);
							}
						},
						Contribution: {
							query({ dateAs }) {
								return agent.get(`/manager/${managerId}/customer/contribution`, {
									params: { dateAs }
								}).then(pickData);
							}
						}
					}),
					Performance: Object.assign(function IManagerPerformance() {

					}, {
						query() {
							return agent.get(`/manager/${managerId}/performance`, {

							}).then(pickData);
						}
					}),
					File: Object.assign(function IManagerFile() {

					}, {
						query() {
							return agent.get(`/manager/${managerId}/file`).then(pickData);
						}
					})
				};
			}, {
				Preview: {
					query(options) {
						return agent.get('/manager/preview', {
							params: { dateAs: options.dateAs }
						}).then(pickData);
					}
				},
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

					return agent.post('/file', formdata).then(pickData);
				},
				query(options) {
					const { planId, managerId } = options;

					return agent.get('/file', {
						params: { planId, managerId }
					}).then(pickData);
				}
			}),
			Plan: Object.assign(function IAccountDataPlan(planId) {
				return {
					get() {
						return agent.get(`/plan/${planId}`).then(pickData);
					},
					update(options) {
						const { name, description } = options;

						return agent.put(`/plan/${planId}`, {
							name, description
						}).then(pickData);
					},
					delete() {
						return agent.delete(`/plan/${planId}`).then(pickData);
					},
					resolve() {
						return agent.post(`/plan/${planId}/result`, {}).then(pickData);
					}
				};
			}, {
				query() {
					return agent.get('/plan').then(pickData);
				},
				create(options) {
					const { name, description, dateAs } = options;

					return agent.post('/plan', { name, dateAs, description }).then(pickData);
				}
			}),
			Present: Object.assign(function IPresent(presentId) {
				return {
					get() {
						return agent.get(`/present/${presentId}`).then(pickData);
					},
					update(options) {
						return agent.put(`/present/${presentId}`, {
							name: options.name,
							price: options.price,
							point: options.point,
							description: options.description
						}).then(pickData);
					},
					delete() {
						return agent.delete(`/present/${presentId}`).then(pickData);
					},
					setEnabled(flag = true) {
						return agent.put(`/present/${presentId}/enabled`, {
							value: flag
						}).then(pickData);
					}
				};
			}, {
				query() {
					return agent.get('/present').then(pickData);
				},
				create(options) {
					return agent.post('/present', {
						name: options.name,
						price: options.price,
						point: options.point,
						description: options.description
					}).then(pickData);
				}
			}),
			Activity: Object.assign(function IActivity(activityId) {
				return {
					get() {
						return agent.get(`/activity/${activityId}`).then(pickData);
					},
					update(options) {
						return agent.put(`/activity/${activityId}`, {
							name: options.name,
							startedAt: options.startedAt,
							endedAt: options.endedAt ? new Date(options.endedAt) : null,
							description: options.description
						}).then(pickData);
					},
					delete() {
						return agent.delete(`/activity/${activityId}`).then(pickData);
					},
					delayTo(endedAt) {
						return agent.put(`/activity/${activityId}/ended-at`, {
							value: endedAt === null ? endedAt: new Date(endedAt)
						}).then(pickData);
					}
				};
			}, {
				query(options = {}) {
					return agent.get('/activity', {
						params: { pending: options.pending }
					}).then(pickData);
				},
				create(options) {
					return agent.post('/activity', {
						name: options.name,
						startedAt: options.startedAt,
						endedAt: options.endedAt ? new Date(options.endedAt) : null,
						description: options.description
					}).then(pickData);
				}
			}),
			Point: Object.assign(function IPoint() {

			}, {
				query() {
					return agent.get('/point').then(pickData);
				},
				Plan: Object.assign(function IPointPlan() {

				}, {
					Preview: {
						query({ planId }) {
							return agent.get('/point/plan/preview', {
								params: { planId }
							}).then(pickData);
						}
					},
					Batch: {
						query() {
							return agent.get('/point/plan/batch').then(pickData);
						},
						create(options) {
							return agent.post('/point/plan/batch', {
								planId: options.planId,
								description: options.description
							}).then(pickData);
						}
					}
				}),
				PlanVariation: Object.assign(function IPointPlanVariation() {

				}, {
					Preview: {
						query({ planId }) {
							return agent.get('/point/plan-variation/preview', {
								params: {
									basePlanId: planId.base,
									targetPlanId: planId.target
								}
							}).then(pickData);
						}
					},
					Batch: {
						query() {
							return agent.get('/point/plan-variation/batch').then(pickData);
						},
						create(options) {
							return agent.post('/point/plan-variation/batch', {
								plan: {
									base: { id: options.plan.base.id },
									target: { id: options.plan.target.id }
								},
								description: options.description
							}).then(pickData);
						}
					}
				}),
				Present: Object.assign(function IPointPresent() {

				}, {
					query() {
						return agent.get('/point/present').then(pickData);
					},
					create(options) {
						return agent.post('/point/present/exchange', {
							amount: options.amount,
							description: options.description,
							customer: { id: options.customerId },
							present: { id: options.presentId }
						}).then(pickData);
					}
				}),
				Activity: Object.assign(function IPointActivity() {

				}, {
					query() {
						return agent.get('/point/activity').then(pickData);
					},
					create(options) {
						return agent.post('/point/activity/reward', {
							point: options.point,
							description: options.description,
							customer: { id: options.customerId },
							activity: { id: options.activityId }
						}).then(pickData);
					}
				}),
				Adjustment: {
					query(options) {
						return agent.get('/point/adjustment', {
							params: { customerId: options.customerId }
						}).then(pickData);
					}
				}
			})
		});

		Vue.prototype.$rusher = {
			backend,
			Utils: {
				localDate: localDate,
				localTime: localTime
			},
			enum: {
				ADJUSTMENT: {
					TYPE: {
						PLAN: '指定时点',
						PLAN_VARIATION: '时点差量',
						ACTIVITY: '参加活动',
						PRESENT: '兑换礼品',
						MANUAL: '手动'
					}
				}
			}
		};
	}
};
