import './customs.scss';

import Vue from 'vue';
import Application from './Application';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';

import bvOptions from './bvOptions.json';

import router from './router';
import i18n from './i18n';

Vue.config.productionTip = false;
Vue.use(BootstrapVue, bvOptions);
Vue.use(BootstrapVueIcons);

new Vue({
	router,
	i18n,
  render: h => h(Application),
}).$mount('#app')
