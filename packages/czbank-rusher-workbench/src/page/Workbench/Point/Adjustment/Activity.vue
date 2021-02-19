<template>

<div style="min-height: 1000px">
	<h1>{{ $t('menu.point.adjustment.activity.label') }}</h1><hr>
	<customer-point-selector
		ref="customer-selector"
		@select="selectedCustomer = $event"
	/>

	<b-button-toolbar>
		<b-form-group
			class="mb-0 mr-1"
			label="客户"
		>
			<b-form-input
				:value="selectedCustomer.name"
				style="width:9em"
				readonly
				placeholder="在上方选择客户"
			/>
		</b-form-group>
		<b-form-group
			class="mb-0 mr-1"
			:label="$t('c.activity.className')"
		>
			<b-form-select
				style="width:16em"
				placeholder="请选择活动"
				v-model="form.activityId"
				:options="optionListOfActivity"
			/>
		</b-form-group>
		<b-form-group
			class="mb-0 mr-1"
			label="奖励积分"
		>
			<b-form-input
				type="number"
				v-model="form.point"
				style="width:6em"
				number
			/>
		</b-form-group>

		<b-form-group
			class="mb-0 mr-1 flex-grow-1"
			label="描述原因"
		>
			<b-form-input
				v-model="form.description"
			/>
		</b-form-group>
	</b-button-toolbar>

	<div class="text-center">
		<b-button
			class="mt-4 w-25 mx-auto"
			size="md"
			variant="primary"
			@click="createActivityReward"
			:disabled="!isValid"
		>发放奖励</b-button>
	</div>
</div>

</template>

<script>
export default {
	data() {
		return {
			Activity: {
				list: [],
			},
			form: {
				point: 0,
				description: '',
				activityId: null
			},
			selectedCustomer: {}
		};
	},
	methods: {
		selectActivity(rows) {
			this.Activity.selectedId = rows.length > 0 ? rows[0].id : null;
		},
		async getAvailableActivityList() {
			this.Activity.list = await this.$rusher.backend.Activity.query({ pending: true });
		},
		async createActivityReward() {
			await this.$rusher.backend.Point.Activity.create({
				point: this.form.point,
				description: this.form.description,
				customerId: this.selectedCustomer.id,
				activityId: this.form.activityId
			});

			await this.$bvModal.msgBoxOk('发放成功', {
				title: '提示',
				okTitle: '知道了',
				okVariant: 'success',
				centered: true
			});

			this.$refs['customer-selector'].refresh();
			this.getAvailableActivityList();
		}
	},
	computed: {
		isValid() {
			return this.form.activityId !== null &&
				this.selectedCustomer.id &&
				this.form.point > 0;
		},
		optionListOfActivity() {
			const list = this.Activity.list.map(activity => {
				return { value: activity.id, text: activity.name };
			});

			return [{ value: null, text: '请选择活动' }].concat(list);
		}
	},
	mounted() {
		this.getAvailableActivityList();
	}
};
</script>

<style>

</style>
