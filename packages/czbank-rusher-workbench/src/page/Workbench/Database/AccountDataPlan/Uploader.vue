<template>

<b-form>
	<b-form-group
		label="客户经理"
	>
		<b-form-select
			:options="managerSelectOptionList"
		></b-form-select>
	</b-form-group>

	<b-form-group
		label="客户经理"
	>
		<b-form-select
			:options="managerSelectOptionList"
		></b-form-select>
	</b-form-group>
</b-form>

</template>

<script>
export default {
	data() {
		return {
			managerList: [],
			form: {
				customerId: '',

			}
		};
	},
	methods: {
		async getManagerList() {

		},

	},
	computed: {
		managerSelectOptionList() {
			return [];
		}
	},
	mounted() {

	}
};
</script>

<style>

</style>
