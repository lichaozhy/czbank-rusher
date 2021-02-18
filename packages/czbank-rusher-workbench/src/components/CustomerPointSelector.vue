<template>

<div style="min-height:365px">
	<b-form-row>
		<b-col cols="auto">
			<h3>客户</h3>
			<b-input-group
				prepend="过滤"
				class="mr-auto"
				size="sm"
			>
				<b-form-input
					v-model="keyword"
					placeholder="搜索客户"
					lazy
					name="manager-customer-search"
					style="width: 12em"
				/>
			</b-input-group>

			<b-table
				sticky-header
				head-variant="light"
				id="customer-table"
				class="w-auto mt-2 border"
				:fields="fieldListOfCustomerPoint"
				:items="itemListOfCustomerPoint"
				small
				hover
				bordered
				selectable
				select-mode="single"
				:filter="keyword"
				@row-selected="select"
				style="min-height:360px"
			>
			</b-table>
		</b-col>
		<b-col>
			<h3>该客户业绩数据</h3>
			<b-table
				sticky-header
				head-variant="light"
				id="performance-table"
				class="h-100"
				:fields="fieldListOfCustomerPerformance"
				:items="itemListOfCustomerPerformance"
				small
				hover
				bordered
				show-empty
				empty-text="选择一个客户以查看其业绩摘要"
			>
				<template #cell(contribution)="row">
					{{ row.item.contribution.toFixed(0) }}
				</template>

				<template #cell(rate)="row">
					{{ (row.item.rate * 100).toFixed(2) + '%' }}
				</template>

				<template #cell(average)="row">
					{{ row.item.average | numeralFloat }}
				</template>

				<template #cell(balance)="row">
					{{ row.item.balance | numeralFloat }}
				</template>

				<template #cell(depositAverage)="row">
					{{ row.item.depositAverage | numeralFloat }}
				</template>

				<template #cell(depositBalance)="row">
					{{ row.item.depositBalance | numeralFloat }}
				</template>

				<template #cell(otherAverage)="row">
					{{ row.item.otherAverage | numeralFloat }}
				</template>

				<template #cell(otherBalance)="row">
					{{ row.item.otherBalance | numeralFloat }}
				</template>
			</b-table>
		</b-col>
	</b-form-row>
</div>

</template>

<script>
export default {
	data() {
		return {
			list: [],
			keyword: '',
			selectedId: null,
			performanceList: []
		};
	},
	watch: {
		selectedId(value) {
			if (value === null) {
				this.performanceList = [];
			} else {
				this.getCustomerPerformanceList();
			}
		}
	},
	computed: {
		selectedCustomer() {
			if (this.selectedId === null) {
				return { name: '' };
			}

			return this.list.find(customerPoint => customerPoint.id === this.selectedId);
		},
		fieldListOfCustomerPoint() {
			return [
				{ key: 'name', label: '名称', class: 'col-short-string' },
				{ key: 'point', label: '积分余额', sortable: true, class: 'col-short-number' },
			];
		},
		itemListOfCustomerPoint() {
			return this.list.map(customerPoint => {
				return {
					id: customerPoint.id,
					name: customerPoint.name,
					point: customerPoint.point
				};
			});
		},
		fieldListOfCustomerPerformance() {
			return [
				{ key: 'dateAs', label: '时点', class: 'col-date'},
				{ key: 'managerName', label: '客户经理', class: 'col-short-string' },
				{ key: 'contribution', label: '贡献度', sortable: true, class: 'text-right' },
				{ key: 'average', label: '金融资产日均', sortable: true, class: 'col-total' },
				{ key: 'balance', label: '金融资产余额', sortable: true, class: 'col-total' },
				{ key: 'depositAverage', label: '存款日均', sortable: true, class: 'col-item' },
				{ key: 'depositBalance', label: '存款余额', sortable: true, class: 'col-item' },
				{ key: 'otherAverage', label: '非存款日均', sortable: true, class: 'col-item' },
				{ key: 'otherBalance', label: '非存款余额', sortable: true, class: 'col-item' },
				{ key: 'blank', label: '', class: 'col-blank' }
			];
		},
		itemListOfCustomerPerformance() {
			return this.performanceList.map(performance => {
				const { customer, contribution } = performance;

				return {
					dateAs: performance.dateAs,
					managerName: performance.manager.name,
					name: customer.name,
					contribution: contribution.value,
					rate: contribution.rate,
					average: contribution.average,
					balance: contribution.balance,
					depositAverage: contribution.deposit.average,
					depositBalance: contribution.deposit.balance,
					otherAverage: contribution.other.average,
					otherBalance: contribution.other.balance,
				};
			});
		}
	},
	methods: {
		select(rows) {
			this.selectedId = rows.length ? rows[0].id : null;
			this.$emit('select', this.selectedCustomer);
		},
		refresh() {
			this.getCustomerPointList();
		},
		async getCustomerPointList() {
			this.list = await this.$rusher.backend.Point.query();
		},
		async getCustomerPerformanceList() {
			this.performanceList = await this.$rusher.backend.Customer.Performance.query({
				customerId: this.selectedId
			});
		},
	},
	mounted() {
		this.refresh();
	}
};
</script>
