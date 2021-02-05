<template>

<div>
	客户经理客户总览
	<b-table
		small
		bordered
		:fields="customerFieldList"
	></b-table>
</div>

</template>

<script>
export default {
	data() {
		return {
			customerList: [],
			productList: [],
			selectedProductCodeMap: {},
		};
	},
	computed: {
		managerId() {
			return this.$route.params.managerId;
		},
		Manager() {
			return this.$rusher.backend.Manager(this.managerId);
		},
		customerItem() {
			return this.customerList.map(customer => {
				return {
					id: customer.id,
					name: customer.name,

				};
			});
		},
		customerFieldList() {
			const productFieldList = [];

			this.productList.forEach(product => {
				if (!this.selectedProductCodeMap[product.code]) {
					return;
				}

				productFieldList.push({
					key: `${product.code}_AD`,
					label: `${product.name}日均存款`,
					sortable: true
				}, {
					key: `${product.code}_B`,
					label: `${product.name}余额`,
					sortable: true
				});
			});

			return [
				{
					key: 'name',
					label: '姓名',
				},
				{
					key: 'average',
					label: '金融资产日均',
					sortable: true
				},
				{
					key: 'balance',
					label: '金融资产余额',
					sortable: true
				},
			].concat(productFieldList);
		}
	},
	methods: {
		async getCustomerList() {
			this.customerList = await this.Manager.Customer.query();
		},
		async getProductList() {
			this.productList = await this.$rusher.backend.Product.query();
		}
	},
	mounted() {
		this.getCustomerList();
		this.getProductList();
	}
};
</script>

<style>

</style>
