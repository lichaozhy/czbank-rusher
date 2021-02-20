import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default function AppStore(options) {
	return new Vuex.Store({
		strict: true,
		state: {
			manager: {
				id: null,
				name: null,
				code: null
			},
			customerId: null
		},
		getters: {
			hasPrincipal: state => {
				return state.manager.id !== null;
			}
		},
		mutations: {
			setPrincipal(state, payload) {
				const { id, name, code } = payload;

				state.manager.id = id;
				state.manager.name = name;
				state.manager.code = code;
			},
			resetPrincipal(state) {
				state.manager.id = null;
				state.manager.name = null;
				state.manager.code = null;
			}
		},
		actions: {
			async fetchPrincipal({ commit }) {
				try {
					commit('setPrincipal', await options.fetchPrincipal());
				} catch (err) {
					console.log('Fetching principal failed.');
					commit('resetPrincipal');
				}
			}
		}
	});
};
