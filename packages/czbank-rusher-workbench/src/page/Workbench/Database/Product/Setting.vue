<template>

<b-form>
	<b-form-row>
		<b-col cols="6">
			<b-form-group
				:label="$t('c.product.fieldIndex.averageDeposit')"
				:description="$t('d.product.averageDepositFieldIndex')"
			>
				<b-form-input
					v-model="form.fieldIndex.averageDeposit"
					trim
					name="product-field-average-deposit"
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
					averageDeposit: '',
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

		this.form.fieldIndex.averageDeposit = product.fieldIndex.averageDeposit;
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
