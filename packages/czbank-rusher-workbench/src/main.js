import './customs.scss';

import Vue from 'vue';
import Application from './Application';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import Rusher from './plugin/rusher';
import Vuelidate from 'vuelidate';

import bvOptions from './bvOptions.json';

import router from './router';
import i18n from './i18n';
import store from './store';

Vue.config.productionTip = false;

Vue.use(BootstrapVue, bvOptions);
Vue.use(BootstrapVueIcons);
Vue.use(Rusher);
Vue.use(Vuelidate);

new Vue({
	router,
	i18n,
	store,
	render: h => h(Application),
}).$mount('#app');
