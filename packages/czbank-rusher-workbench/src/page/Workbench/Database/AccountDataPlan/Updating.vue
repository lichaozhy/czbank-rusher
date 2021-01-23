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
			:value="dateAs"
			readonly
			name="plan-dateas"
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
			dateAs: '',
			form: {
				name: '',
				description: ''
			}
		};
	},
	props: {
		planId: {
			type: String,
			required: true
		}
	},
	methods: {
		async update() {
			return this.$rusher.backend.AccountDataPlan(this.planId).update({
				name: this.form.name,
				description: this.form.description
			});
		}
	},
	async mounted() {
		const plan = await this.$rusher.backend.AccountDataPlan(this.planId).get();

		this.dateAs = plan.dateAs;
		this.form.name = plan.name;
		this.form.description = plan.description;
	}
};
</script>

<style>

</style>
