import Vue from 'vue';
import VueRouter from 'vue-router';

import Page from './page';

Vue.use(VueRouter);

export default new VueRouter({
	linkActiveClass: 'active',
	routes: [
		{
			name: 'home',
			path: '/',
			redirect: {
				name: 'welcome'
			}
		},
		{
			name: 'welcome',
			path: '/welcome',
			component: Page.Welcome,
			meta: {
				noPrincipalRequired: true
			}
		},
		{
			name: 'workbench',
			path: '/workbench',
			component: Page.Workbench.Framework,
			meta: {
				principalRequired: true
			},
			redirect: {
				name: 'workbench.customer'
			},
			children: [
				{
					name: 'workbench.manager',
					path: 'manager',
					component: Page.Workbench.Manager
				},
				{
					name: 'workbench.customer',
					path: 'customer',
					component: Page.Workbench.Customer
				},
				{
					name: 'workbench.activity',
					path: 'activity',
					component: Page.Workbench.Activity
				},
				{
					name: 'workbench.present',
					path: 'present',
					component: Page.Workbench.Present
				}
			]
		}
	]
});
