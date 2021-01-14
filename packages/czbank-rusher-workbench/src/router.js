import Vue from 'vue';
import VueRouter from 'vue-router'

import Page from './page';

Vue.use(VueRouter);

export default new VueRouter({
	linkActiveClass: 'active',
	mode: 'hash',
	routes: [
		{
			name: 'home',
			path: '/',
			redirect: {
				name: 'workbench'
			}
		},
		{
			name: 'signin',
			path: '/signin',
			component: Page.SignIn
		},
		{
			name: 'workbench',
			path: '/workbench',
			component: Page.Workbench.Framework,
			meta: {
				principalRequired: true
			},
			redirect: {
				name: 'workbench.database'
			},
			children: [
				{
					name: 'workbench.analysis',
					path: 'analysis',
					component: Page.Workbench.Analysis.Framework,
					children: [

					]
				},
				{
					name: 'workbench.database',
					path: 'database',
					redirect: {
						name: 'workbench.database.account-data-importer',
					},
					component: Page.Workbench.Database.Framework,
					children: [
						{
							name: 'workbench.database.account-data-importer',
							path: 'account-data-importer',
							component: Page.Workbench.Database.AccountDataImporter
						}
					]
				},
				{
					name: 'workbench.present',
					path: 'present',
					component: Page.Workbench.Present.Framework,
					redirect: {
						name: 'workbench.present.overview'
					},
					children: [
						{
							name: 'workbench.present.overview',
							path: 'overview',
							component: Page.Workbench.Present.Overview
						},
						{
							name: 'workbench.present.register',
							path: 'register',
							component: Page.Workbench.Present.Register
						}
					]
				}
			]
		}
	]
});
