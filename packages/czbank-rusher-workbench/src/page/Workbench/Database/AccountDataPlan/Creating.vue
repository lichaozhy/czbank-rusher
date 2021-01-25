<template>

<b-form>
	<b-form-group
		:label="$t('c.account.data.plan.name')"
		:description="$t('d.plan.name')"
	>
		<b-form-input
			v-model="form.name"
			trim
			name="plan-name"
			autocomplete="off"
		/>
	</b-form-group>

	<b-form-group
		:label="$t('c.account.data.plan.dateAs')"
		:description="$t('d.plan.dateAs')"
	>
		<b-form-datepicker
			v-model="form.dateAs"
			name="plan-dateas"
			:date-disabled-fn="disabledDate"
			button-variant="primary"
			nav-button-variant="primary"
		/>
	</b-form-group>

	<b-form-group
		:label="$t('c.base.description')"
		:description="$t('d.plan.description')"
	>
		<b-form-textarea
			v-model="form.description"
			trim
			name="plan-description"
			autocomplete="off"
			style="height: 8em"
		/>
	</b-form-group>
</b-form>

</template>

<script>
export default {
	data() {
		return {
			planList: [],
			form: {
				name: '',
				dateAs: '',
				description: ''
			}
		};
	},
	methods: {
		async getPlanList() {
			this.planList = await this.$rusher.backend.AccountDataPlan.query();
		},
		async create() {
			return this.$rusher.backend.AccountDataPlan.create({
				name: this.form.name,
				dateAs: new Date(this.form.dateAs),
				description: this.form.description
			});
		},
		disabledDate(ymd) {
			return this.planList.some(plan => plan.dateAs === ymd);
		}
	},
	mounted() {
		this.getPlanList();
	}
};
</script>

<style>

</style>
