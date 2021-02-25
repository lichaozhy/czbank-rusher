<template>

<div
	class="py-3 d-flex flex-column h-100"
>
	<b-form-input
		:value="currentCustomerName"
		readonly
		placeholder="请到找客户面板设置当前客户"
		@click="jumpToCustomer"
	/>

	<div
		class="mt-3 flex-grow-1 overflow-auto"
	>
		<b-form-group
			label="选择活动"
		>
			<b-form-select
				:options="optionListOfActivity"
				v-model="form.activityId"
			></b-form-select>
		</b-form-group>

		<b-form-group
			label="奖励积分"
		>
			<b-form-input
				name="activity-reward-point"
				v-model="form.point"
			/>
		</b-form-group>

		<b-form-group
			label="描述原因"
		>
			<b-form-textarea
				style="height: 6em"
				name="activity-reward-description"
				v-model="form.description"
			/>
		</b-form-group>
	</div>

	<b-button
		class="mt-3"
		variant="danger"
		size="lg"
	>发放活动积分</b-button>
</div>

</template>

<script>
import customer from './mixin/customer';
import point from './mixin/point';

export default {
	name: 'Workbench.Activity',
	data() {
		return {
			activityList: [],
			form: {
				activityId: null,
				point: 0,
				description: ''
			}
		};
	},
	computed: {
		optionListOfActivity() {
			const list = this.activityList.map(activity => {
				return { value: activity.id, text: activity.name };
			});

			return [{ value: null, text: '请选择活动' }].concat(list);
		}
	},
	mixins: [customer, point]
};
</script>

<style>

</style>
