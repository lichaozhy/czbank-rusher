<template>

<b-form>
	<b-form-group
		:label="$t('c.product.name')"
		:description="$t('d.product.name')"
		valid-feedback="合法的产品名"
	>
		<b-form-input
			v-model="form.name"
			trim
			name="product-name"
			autocomplete="off"
		/>
	</b-form-group>

	<b-form-group
		:label="$t('c.product.code')"
		:description="$t('d.product.code')"
		valid-feedback="合法的产品名"
	>
		<b-form-input
			v-model="form.code"
			trim
			name="product-code"
			autocomplete="off"
		/>
	</b-form-group>

	<b-form-group
		:label="$t('c.product.description')"
		:description="$t('d.product.description')"
		valid-feedback="合法的产品名"
	>
		<b-form-textarea
			v-model="form.description"
			trim
			name="product-description"
			autocomplete="off"
			style="height: 8em"
		/>
	</b-form-group>
</b-form>

</template>

<script>
export default {
	name: 'ProductCreating',
	data() {
		return {
			form: {
				name: '',
				code: '',
				description: ''
			}
		};
	},
	methods: {
		async create() {
			await this.$rusher.backend.Product.create({
				name: this.form.name,
				code: this.form.code,
				description: this.form.description
			});
		}
	}
};
</script>

<style>

</style>
