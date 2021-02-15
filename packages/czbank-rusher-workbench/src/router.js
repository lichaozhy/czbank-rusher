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
				name: 'workbench.manager'
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
						name: 'workbench.database.account-data-plan',
					},
					component: Page.Workbench.Database.Framework,
					children: [
						{
							name: 'workbench.database.account-data-plan',
							path: 'account-data-plan',
							component: Page.Workbench.Database.AccountDataPlan.Overview
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
						},
						{
							name: 'workbench.manager.contribution',
							path: 'contribution',
							component: Page.Workbench.Manager.Contribution
						}
					]
				},
				{
					name: 'workbench.manager.detail',
					path: 'manager/detail/:managerId',
					component: Page.Workbench.Manager.Detail.Framework,
					redirect: {
						name: 'workbench.manager.detail.customer'
					},
					children: [
						{
							name: 'workbench.manager.detail.customer',
							path: 'customer',
							component: Page.Workbench.Manager.Detail.Customer
						},
						{
							name: 'workbench.manager.detail.customer-change',
							path: 'customer-change',
							component: Page.Workbench.Manager.Detail.CustomerChange
						},
					]
				},
				{
					name: 'workbench.point',
					path: 'point',
					component: Page.Workbench.Point.Framework,
					redirect: {
						name: 'workbench.point.overview'
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
							name: 'workbench.point.adjustment.plan',
							path: 'adjustment/plan',
							component: Page.Workbench.Point.Adjustment.Plan
						},
						{
							name: 'workbench.point.adjustment.plan-variation',
							path: 'adjustment/plan-variation',
							component: Page.Workbench.Point.Adjustment.PlanVariation
						},
						{
							name: 'workbench.point.adjustment.activity',
							path: 'adjustment/activity',
							component: Page.Workbench.Point.Adjustment.Activity
						},
						{
							name: 'workbench.point.adjustment.present',
							path: 'adjustment/present',
							component: Page.Workbench.Point.Adjustment.Present
						},
						{
							name: 'workbench.point.adjustment.manual',
							path: 'adjustment/manual',
							component: Page.Workbench.Point.Adjustment.Manual
						}
					]
				},
				{
					name: 'workbench.activity',
					path: 'activity',
					component: Page.Workbench.Activity.Framework,
					redirect: {
						name: 'workbench.activity.overview'
					},
					children: [
						{
							name: 'workbench.activity.overview',
							path: 'overview',
							component: Page.Workbench.Activity.Overview
						},
						{
							name: 'workbench.activity.register',
							path: 'register',
							component: Page.Workbench.Activity.Register
						}
					]
				}
			]
		}
	]
});
