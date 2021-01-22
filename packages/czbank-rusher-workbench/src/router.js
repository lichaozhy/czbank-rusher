import Vue from 'vue';
import VueRouter from 'vue-router';

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
					redirect: {
						name: 'workbench.analysis.customer-asset-distribution'
					},
					children: [
						{
							name: 'workbench.analysis.customer-gender-rate',
							path: 'customer-gender-rate',
							component: Page.Workbench.Analysis.CustomerGenderRate
						},
						{
							name: 'workbench.analysis.customer-age-distribution',
							path: 'customer-age-distribution',
							component: Page.Workbench.Analysis.CustomerAgeDistribution
						},
						{
							name: 'workbench.analysis.customer-asset',
							path: 'customer-asset',
							component: Page.Workbench.Analysis.CustomerAsset
						},
						{
							name: 'workbench.analysis.customer-asset-distribution',
							path: 'customer-asset-distribution',
							component: Page.Workbench.Analysis.CustomerAssetDistribution
						},
						{
							name: 'workbench.analysis.customer-relation',
							path: 'customer-relatio',
							component: Page.Workbench.Analysis.CustomerRelation
						},
						{
							name: 'workbench.analysis.manager-contribution-value-distribution',
							path: 'manager-contribution-value-distribution',
							component: Page.Workbench.Analysis.ManagerContributionValueDistribution
						},
						{
							name: 'workbench.analysis.manager-customer-contribution-value-distribution',
							path: 'manager-customer-contribution-value-distribution',
							component: Page.Workbench.Analysis.ManagerCustomerContributionValueDistribution
						},
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
						},
						{
							name: 'workbench.database.product',
							path: 'product',
							component: Page.Workbench.Database.Product.Overview
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
				},
				{
					name: 'workbench.customer',
					path: 'customer',
					component: Page.Workbench.Customer.Framework,
					redirect: {
						name: 'workbench.customer.overview'
					},
					children: [
						{
							name: 'workbench.customer.overview',
							path: 'overview',
							component: Page.Workbench.Customer.Overview
						},
						{
							name: 'workbench.customer.register',
							path: 'register',
							component: Page.Workbench.Customer.Register
						}
					]
				},
				{
					name: 'workbench.manager',
					path: 'manager',
					component: Page.Workbench.Manager.Framework,
					redirect: {
						name: 'workbench.manager.overview'
					},
					children: [
						{
							name: 'workbench.manager.overview',
							path: 'overview',
							component: Page.Workbench.Manager.Overview
						},
						{
							name: 'workbench.manager.register',
							path: 'register',
							component: Page.Workbench.Manager.Register
						}
					]
				},
				{
					name: 'workbench.manager.detail',
					path: 'manager/detail/:managerId',
					component: Page.Workbench.Manager.Detail
				},
				{
					name: 'workbench.point',
					path: 'point',
					component: Page.Workbench.Point.Framework,
					redirect: {
						name: 'workbench.point.history'
					},
					children: [
						{
							name: 'workbench.point.overview',
							path: 'overview',
							component: Page.Workbench.Point.Overview
						},
						{
							name: 'workbench.point.history',
							path: 'history',
							component: Page.Workbench.Point.History
						},
						{
							name: 'workbench.point.adjustment',
							path: 'adjustment',
							component: Page.Workbench.Point.Adjustment
						}
					]
				}
			]
		}
	]
});
