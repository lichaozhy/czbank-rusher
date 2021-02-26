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
				:disabled="!hasCurrentCustomer"
			></b-form-select>
		</b-form-group>

		<b-table
			:fields="fieldListOfActivity"
			:items="[selectedActivity]"
			stacked
			small
		>
			<template
				#cell(startedAt)="{ item }"
			><span
				v-if="item.id"
			>{{ item.startedAt | localDatetime }}</span></template>

			<template
				#cell(endedAt)="{ item }"
			><span
				v-if="item.id && item.endedAt !== null"
			>{{ item.endedAt | localDatetime }}</span><em
				v-if="item.id && item.endedAt === null"
			>永久有效</em></template>
		</b-table>

		<b-form-group
			label="奖励积分"
		>
			<b-form-input
				name="activity-reward-point"
				v-model="form.point"
				:disabled="!hasCurrentCustomer"
				number
				type="number"
				autocomplete="off"
			/>
		</b-form-group>

		<b-form-group
			label="描述原因"
		>
			<b-form-textarea
				style="height: 6em"
				name="activity-reward-description"
				v-model="form.description"
				:disabled="!hasCurrentCustomer"
			/>
		</b-form-group>

		<p
			v-if="form.presentId !== null && currentCustomer !== null && form.point > 0"
			class="text-center"
		>当前积分<b
			class="mx-1"
		>{{ currentCustomer.point }}</b>点，发放<b
			class="mx-1"
		>{{ form.point }}</b>后，总计<b
			class="mx-1"
		>{{ currentCustomer.point + form.point }}</b>点</p>
	</div>

	<b-button
		class="mt-3"
		variant="danger"
		size="lg"
		:disabled="!isValid"
		@click="createActivityReward"
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
		},
		selectedActivity() {
			return this.activityList
				.find(activity => activity.id === this.form.activityId) || {};
		},
		isValid() {
			return this.form.point > 0 &&
				this.form.activityId !== null &&
				this.hasCurrentCustomer;
		},
		fieldListOfActivity() {
			return [
				{ key: 'name', label: '活动名称' },
				{ key: 'startedAt', label: '开始时间' },
				{ key: 'endedAt', label: '结束时间' },
				{ key: 'description', label: '描述' }
			];
		}
	},
	methods: {
		resetForm() {
			this.form = {
				activityId: null,
				point: 0,
				description: ''
			};
		},
		async getActivityList() {
			this.activityList = await this.$manager.backend.Activity.query();
		},
		async createActivityReward() {
			await this.$manager.backend.Activity.reward({
				customerId: this.currentCustomer.id,
				activityId: this.form.activityId,
				point: this.form.point,
				description: this.form.description
			});

			await this.$bvModal.msgBoxOk('发放成功', {
				title: '提示',
				centered: true,
				okTitle: '知道了'
			});

			this.getCustomerById(this.currentCustomerId);
			this.resetForm();
		}
	},
	mounted() {
		this.getActivityList();
	},
	mixins: [customer, point]
};
</script>

<style>

</style>
