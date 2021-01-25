import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	strict: true,
	state: {
		currentDateAs: null
	},
	mutations: {
		setCurrentDateAs(state, dateAs = null) {
			state.currentDateAs = dateAs;
		}
	}
});
