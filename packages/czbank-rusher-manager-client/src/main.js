import './customs.scss';

import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import Vuelidate from 'vuelidate';

import './registerServiceWorker';

import router from './router';
import AppStore from './store';
import Rusher from './plugin/manager';
import bvOptions from './bvOptions.json';

import App from './App.vue';
import Performance from './components/Performance';

Vue.config.productionTip = false;

Vue.use(BootstrapVue, bvOptions);
Vue.use(BootstrapVueIcons);
Vue.use(Rusher);
Vue.use(Vuelidate);

Vue.component('AppPerformance', Performance);

const store = AppStore({
	async fetchPrincipal() {
		return Rusher.backend.Manager.get();
	}
});

/**
 * Trying to intercept a wrong route.
 *
 * @param {import('vue-router').Route} route
 */
async function go(route) {
	if (route.matched.find(match => match.meta.isDev)) {
		return;
	}

	const requiredPrincipal = {
		yes: route.matched.find(match => match.meta.principalRequired),
		no: route.matched.find(match => match.meta.noPrincipalRequired)
	};

	await store.dispatch('fetchPrincipal');
	const signedin = store.getters.hasPrincipal;

	if (route.matched.length === 0) {
		return { name: signedin ? 'workbench' : 'welcome' };
	}

	if (signedin && requiredPrincipal.no) {
		return { name: 'workbench' };
	}

	if (!signedin && requiredPrincipal.yes) {
		return { name: 'welcome' };
	}
}

const application = new Vue({ router, store, render: h => h(App) });

router.beforeEach(async function guard(to, _from, next) {
	next(await go(to));
});

window.addEventListener('load', async function bootstrap() {
	/**
	 * Installing router.
	 */
	const genesisHash = document.location.hash.substr(1);
	const { route } = router.resolve(genesisHash);
	const target = await go(route);

	if (target) {
		router.push(target);
	}

	application.$mount('#app');
});
