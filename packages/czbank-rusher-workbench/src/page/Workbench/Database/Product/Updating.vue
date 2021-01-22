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
		valid-feedback="合法的代号"
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
		valid-feedback="合法的描述"
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
	name: 'ProductCUpdating',
	data() {
		return {
			form: {
				name: '',
				code: '',
				description: ''
			}
		};
	},
	props: {
		productId: {
			type: String,
			required: true
		}
	},
	async mounted() {
		const product = await this.$rusher.backend.Product(this.productId).get();

		this.form.name = product.name;
		this.form.code = product.code;
		this.form.description = product.description;
	},
	methods: {
		async update() {
			await this.$rusher.backend.Product(this.productId).update({
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
