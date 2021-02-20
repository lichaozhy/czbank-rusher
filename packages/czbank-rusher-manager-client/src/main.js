import './customs.scss';

import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import Vuelidate from 'vuelidate';

import './registerServiceWorker';

import router from './router';
import store from './store';
import bvOptions from './bvOptions.json';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(BootstrapVue, bvOptions);
Vue.use(BootstrapVueIcons);
Vue.use(Vuelidate);

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
