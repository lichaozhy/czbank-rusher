<template>

<b-form>
	<b-form-row>
		<b-col cols="6">
			<b-form-group
				:label="$t('c.product.fieldIndex.average')"
				:description="$t('d.product.averageFieldIndex')"
			>
				<b-form-input
					v-model="form.fieldIndex.average"
					trim
					name="product-field-average"
					autocomplete="off"
				/>
			</b-form-group>
		</b-col>

		<b-col cols="6">
			<b-form-group
				:label="$t('c.product.fieldIndex.balance')"
				:description="$t('d.product.balanceFieldIndex')"
			>
				<b-form-input
					v-model="form.fieldIndex.balance"
					trim
					name="product-field-balance"
					autocomplete="off"
				/>
			</b-form-group>
		</b-col>
	</b-form-row>

</b-form>

</template>

<script>
export default {
	name: 'ProductCUpdating',
	data() {
		return {
			form: {
				fieldIndex: {
					average: '',
					balance: ''
				}
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

		this.form.fieldIndex.average = product.fieldIndex.average;
		this.form.fieldIndex.balance = product.fieldIndex.balance;
	},
	methods: {
		async update() {
			await this.$rusher.backend.Product(this.productId)
				.update({ fieldIndex: this.form.fieldIndex });
		}
	}
};
</script>

<style>

</style>
