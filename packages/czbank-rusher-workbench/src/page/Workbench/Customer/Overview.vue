<template>

<div>
	<h1>客户总览</h1><hr>

	<ul class="list-unstyled">
		<li>{{ $t('d.contributionExp') }}</li>
	</ul>

	<b-button-toolbar>
		<b-input-group
			prepend="过滤"
			class="mr-auto"
			size="sm"
		>
			<b-form-input
				v-model="table.keyword"
				placeholder="搜索客户"
				lazy
				name="manager-customer-search"
				style="width: 8em"
			/>
		</b-input-group>

		<b-input-group
			prepend="选择时点"
			class="mr-auto"
		>
			<b-form-select
				name="manager-name"
				:options="dateAsOptionList"
				v-model="dateAs"
				:disabled="dateAs === null"
				style="width:10em"
			/>
		</b-input-group>

    <b-pagination
			class="m-0"
      v-model="table.currentPage"
      :total-rows="table.filteredLength"
      :per-page="table.perPage"
      aria-controls="my-table"
			size="sm"
    ></b-pagination>
	</b-button-toolbar>

	<b-table
		head-variant="light"
		id="customer-table"
		class="mt-3"
		small
		bordered
		:fields="customerFieldList"
		:items="customerItem"
		:per-page="table.perPage"
		:current-page="table.currentPage"
		:filter="table.keyword"
		hover
		ref="customerTable"
		@filtered="updateLength"
		select-mode="single"
		selectable
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
</div>

</template>

<script>
export default {
	data() {
		return {
			table: {
				keyword: '',
				currentPage: 1,
				perPage: 20,
				filteredLength: 0
			},
			dateAs: null,
			planList: [],
			customerPerformanceList: []
		};
	},
	methods: {
		updateLength() {
			this.table.filteredLength = this.$refs.customerTable.filteredItems.length;
		},
		async getPlanList() {
			this.planList = await this.$rusher.backend.Plan.query();

			if (this.planList.length > 0) {
				this.dateAs = this.planListSortedByDateAs[0].dateAs;
			}
		},
		async getCustomerPerformanceList() {
			this.customerPerformanceList =
				await this.$rusher.backend.Customer.Performance.query({
					dateAs: this.dateAs
				});

			this.$nextTick(() => this.updateLength());
		}
	},
	watch: {
		dateAs() {
			this.getCustomerPerformanceList();
		}
	},
	computed: {
		planListSortedByDateAs() {
			return this.planList.slice(0).sort((a, b) => a.dateAs - b.dateAs);
		},
		dateAsOptionList() {
			if (this.planListSortedByDateAs.length === 0) {
				return [{ value: null, text: '无可用的时点' }];
			} else {
				return this.planListSortedByDateAs.map(plan => {
					return { value: plan.dateAs, text: plan.dateAs };
				});
			}
		},
		customerFieldList() {
			return [
				{ key: 'name', label: '姓名', class: 'col-tiny-string'},
				{ key: 'contribution', label: '贡献度', sortable: true, class: 'col-short-number' },
				{ key: 'point', label: '积分余额', sortable: true, class: 'col-short-number' },
				{ key: 'managerName', label: '客户经理', class: 'col-short-string'},
				{ key: 'rate', label: '存款占比', sortable: true, class: 'col-short-number' },
				{ key: 'average', label: '金融资产日均', sortable: true, class: 'col-number' },
				{ key: 'balance', label: '金融资产余额', sortable: true, class: 'col-number' },
				{ key: 'depositAverage', label: '存款日均', sortable: true, class: 'col-number' },
				{ key: 'depositBalance', label: '存款余额', sortable: true, class: 'col-number' },
				{ key: 'otherAverage', label: '非存款日均', sortable: true, class: 'col-number' },
				{ key: 'otherBalance', label: '非存款余额', sortable: true, class: 'col-number' },
				{ key: 'blank', label: '', class: 'col-auto-blank' }
			];
		},
		customerItem() {
			return this.customerPerformanceList.map(performance => {
				const { customer, contribution, manager } = performance;

				return {
					name: customer.name,
					managerName: manager.name,
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
		},
	},
	async mounted() {
		await this.getPlanList();
	}
};
</script>

<style lang="scss">
#customer-table {
	.col-total {
		width: 10em;
		text-align: right;
	}

	.col-name {
		width: 8em;
	}

	.col-item {
		width: 8em;
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
