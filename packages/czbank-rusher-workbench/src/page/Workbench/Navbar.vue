<template>

<b-navbar
	type="dark"
	variant="dark"
>
	<b-navbar-brand
		:to="{ name: 'home' }"
	>CZB<b
		class="ml-1"
	>Rusher</b></b-navbar-brand>

	<b-navbar-nav>
		<b-nav-item
			:to="{ name: 'workbench.analysis' }"
		><b-icon-graph-up
			class="mr-1"
		/>{{ $t('menu.analysis.label') }}</b-nav-item>

		<b-nav-item
			:to="{ name: 'workbench.customer' }"
		><b-icon-people-fill
			class="mr-1"
		/>{{ $t('menu.customer.label') }}</b-nav-item>

		<b-nav-item
			:to="{ name: 'workbench.manager' }"
		><b-icon-person-badge
			class="mr-1"
		/>{{ $t('menu.manager.label') }}</b-nav-item>

		<b-nav-item
			:to="{ name: 'workbench.present' }"
		><b-icon-gift-fill
			class="mr-1"
		/>{{ $t('menu.present.label') }}</b-nav-item>

		<b-nav-item
			:to="{ name: 'workbench.point' }"
		><b-icon-star-fill
			class="mr-1"
		/>{{ $t('menu.point.label') }}</b-nav-item>

		<b-nav-item
			:to="{ name: 'workbench.activity' }"
		><b-icon-calendar2-date
			class="mr-1"
		/>{{ $t('menu.activity.label') }}</b-nav-item>

		<b-nav-item
			:to="{ name: 'workbench.database' }"
		><b-icon-server
			class="mr-1"
		/>{{ $t('menu.database.label') }}</b-nav-item>
	</b-navbar-nav>
<!--
	<b-navbar-nav class="ml-auto">
		<b-nav-form>
			<b-form-select
				size="sm"
				style="width:8em"
				placeholder="没有可用的导入计划"
				:options="planOptionList"
				:value="currentPlanId"
				:disabled="planList.length === 0"
				@change="setGlobalPlanDateAs($event)"
			/>
		</b-nav-form>
	</b-navbar-nav> -->

</b-navbar>

</template>

<script>
export default {
	data() {
		return {
			planList: []
		};
	},
	methods: {
		// async getPlanList() {
		// 	this.planList = await this.$rusher.backend.AccountDataPlan.query();
		// },
		setGlobalPlanDateAs(dateAs) {
			this.$store.commit('setCurrentDateAs', dateAs);
		}
	},
	mounted() {
		// this.getPlanList();
	},
	computed: {
		planOptionList() {
			return this.planList.length === 0 ? [
				{
					value: null,
					text: '无可用的导入计划'
				}
			] : this.planList.map(plan => {
				return {
					value: plan.dateAs,
					text: plan.dateAs
				};
			});
		},
		currentPlanId() {
			return '2020-12-31';
		}
	}
};
</script>

<style>

</style>
