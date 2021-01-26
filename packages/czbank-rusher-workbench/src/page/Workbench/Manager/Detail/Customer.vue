<template>

<div>
	<h1>客户总览</h1><hr>

	<b-button-toolbar>
		<b-input-group
			prepend="过滤"
			class="mr-auto"
		>
			<b-form-input
				v-model="keyword"
				placeholder="搜索客户"
				lazy
			/>
		</b-input-group>

    <b-pagination
			class="m-0"
      v-model="currentPage"
      :total-rows="filteredLength"
      :per-page="perPage"
      aria-controls="my-table"
			limit="9"
    ></b-pagination>
	</b-button-toolbar>

	<b-table
		id="manager-customer-table"
		class="mt-3"
		small
		bordered
		:fields="customerFieldList"
		:items="customerItem"
		:per-page="perPage"
		:current-page="currentPage"
		:filter="keyword"
		hover
		ref="customerTable"
		@filtered="updateLength"
	>
		<template #cell(contribution)="row">
			{{ row.item.contribution.toFixed(0) }}
		</template>

		<template #cell(averageDeposit)="row">
			{{ row.item.averageDeposit | numeralFloat }}
		</template>

		<template #cell(depositRate)="row">
			{{ (row.item.depositRate * 100).toFixed(2) + '%' }}
		</template>

		<template #cell(balance)="row">
			{{ row.item.balance | numeralFloat }}
		</template>

		<template #cell(depositAD)="row">
			{{ row.item.depositAD | numeralFloat }}
		</template>

		<template #cell(depositB)="row">
			{{ row.item.depositB | numeralFloat }}
		</template>

		<template #cell(nonDepositAD)="row">
			{{ row.item.nonDepositAD | numeralFloat }}
		</template>

		<template #cell(nonDepositB)="row">
			{{ row.item.nonDepositB | numeralFloat }}
		</template>
	</b-table>
</div>

</template>

<script>
const DEPOSIT_PRODUCT_CODE = 'DEPOSIT';

export default {
	data() {
		return {
			keyword: '',
			currentPage: 1,
			perPage: 25,
			customerList: [],
			productList: [],
			selectedProductCodeMap: {},
			filteredLength: 0
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
				const { data } = customer;

				const item = {
					id: customer.id,
					name: customer.name,
					contribution: 0,
					averageDeposit: 0,
					balance: 0,
					depositRate: 0,
					depositAD: 0,
					depositB: 0,
					nonDepositAD: 0,
					nonDepositB: 0,
					dateAs: customer.dateAs
				};

				if (data[DEPOSIT_PRODUCT_CODE]) {
					const { averageDeposit, balance } = data[DEPOSIT_PRODUCT_CODE];

					item.depositAD = averageDeposit;
					item.depositB = balance;
				}

				Object.keys(data).forEach(productCode => {
					const { averageDeposit, balance } = data[productCode];

					item.averageDeposit += averageDeposit;
					item.balance += balance;
				});

				item.depositAD = Number(item.depositAD.toFixed(2));
				item.depositB = Number(item.depositB.toFixed(2));
				item.averageDeposit = Number(item.averageDeposit.toFixed(2));
				item.balance = Number(item.balance.toFixed(2));

				item.nonDepositAD = Number((item.averageDeposit - item.depositAD).toFixed(2));
				item.nonDepositB = Number((item.balance - item.depositB).toFixed(2));
				item.depositRate = Number((item.depositAD / item.averageDeposit).toFixed(2));

				item.contribution = Number(((item.depositAD * 2 + item.nonDepositAD) / 10000).toFixed(2));

				return item;
			});
		},
		customerFieldList() {
			return [
				{
					key: 'name',
					label: '姓名',
				},
				{
					key: 'contribution',
					label: '贡献度',
					sortable: true,
					class: 'text-right'
				},
				{
					key: 'depositRate',
					label: '存款占比',
					sortable: true,
					class: 'col-rate text-right'
				},
				{
					key: 'averageDeposit',
					label: '金融资产日均',
					sortable: true,
					class: 'col-total'
				},
				{
					key: 'balance',
					label: '金融资产余额',
					sortable: true,
					class: 'col-total'
				},
				{
					key: 'depositAD',
					label: '存款日均',
					sortable: true,
					class: 'col-item'
				},
				{
					key: 'depositB',
					label: '存款余额',
					sortable: true,
					class: 'col-item'
				},
				{
					key: 'nonDepositAD',
					label: '非存款日均',
					sortable: true,
					class: 'col-item'
				},
				{
					key: 'nonDepositB',
					label: '非存款余额',
					sortable: true,
					class: 'col-item'
				},
				{
					key: 'blank',
					label: '',
					class: 'col-blank',
				}
				// {
				// 	key: 'dateAs',
				// 	label: '时点',
				// 	sortable: true,
				// 	class: 'col-dateas'
				// },
			];
		}
	},
	methods: {
		updateLength() {
			this.filteredLength = this.$refs.customerTable.filteredItems.length;
		},
		async getCustomerList() {
			this.customerList = await this.Manager.Customer.query();
		},
		async getProductList() {
			this.productList = await this.$rusher.backend.Product.query();
			this.updateLength();
		}
	},
	mounted() {
		this.getCustomerList();
		this.getProductList();
	}
};
</script>

<style lang="scss">
#manager-customer-table {
	.col-total {
		width: 12em;
		text-align: right;
	}

	.col-item {
		width: 10em;
		text-align: right;
	}

	.col-dateas {
		width: 6em;
	}

	.col-rate {
		width: 6em;
	}
}
</style>
