<template>

<div>
	<h1>客户总览</h1><hr>

	<b-button-toolbar>
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

		<b-input-group
			prepend="每页"
			append="条"
			class="mr-1"
			size="sm"
		>
			<b-form-input
				style="width: 5em"
				max="30"
				min="10"
				v-model="perPage"
				type="number"
				autocomplete="off"
				class="text-center"
			/>
		</b-input-group>

		<b-input-group
			prepend="第"
			append="页"
			class="mr-auto"
			size="sm"
		>
			<b-form-input
				style="width: 5em"
				v-model="currentPage"
				type="number"
				autocomplete="off"
				class="text-center"
			/>
		</b-input-group>

    <b-pagination
			class="m-0"
      v-model="currentPage"
      :total-rows="filteredLength"
      :per-page="perPage"
      aria-controls="my-table"
			size="sm"
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
			keyword: '',
			currentPage: 1,
			perPage: 20,
			customerPerformanceList: [],
			selectedProductCodeMap: {},
			filteredLength: 0,
			fileList: [],
			dateAs: null
		};
	},
	computed: {
		managerId() {
			return this.$route.params.managerId;
		},
		Manager() {
			return this.$rusher.backend.Manager(this.managerId);
		},
		dateAsOptionList() {
			if (this.fileListSortedByDateAs.length === 0) {
				return [{ value: null, text: '无可用的时点' }];
			} else {
				return this.fileListSortedByDateAs.map(file => {
					return { value: file.plan.dateAs, text: file.plan.dateAs };
				});
			}
		},
		fileListSortedByDateAs() {
			return this.fileList.slice(0).sort((a, b) => a.plan.dateAs - b.plan.dateAs);
		},
		customerItem() {
			return this.customerPerformanceList.map(performance => {
				const { customer, contribution } = performance;

				return {
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
		},
		customerFieldList() {
			return [
				{ key: 'name', label: '姓名', },
				{ key: 'contribution', label: '贡献度', sortable: true, class: 'text-right' },
				{ key: 'rate', label: '存款占比', sortable: true, class: 'col-rate text-right' },
				{ key: 'average', label: '金融资产日均', sortable: true, class: 'col-total' },
				{ key: 'balance', label: '金融资产余额', sortable: true, class: 'col-total' },
				{ key: 'depositAverage', label: '存款日均', sortable: true, class: 'col-item' },
				{ key: 'depositBalance', label: '存款余额', sortable: true, class: 'col-item' },
				{ key: 'otherAverage', label: '非存款日均', sortable: true, class: 'col-item' },
				{ key: 'otherBalance', label: '非存款余额', sortable: true, class: 'col-item' },
				{ key: 'blank', label: '', class: 'col-blank' }
			];
		}
	},
	watch: {
		dateAs() {
			this.getCustomerPerformanceList();
		}
	},
	methods: {
		updateLength() {
			this.filteredLength = this.$refs.customerTable.filteredItems.length;
		},
		async getCustomerPerformanceList() {
			this.customerPerformanceList = await this.Manager.Customer.Performance.query({
				dateAs: this.dateAs
			});

			this.$nextTick(() => this.updateLength());
		},
		async getManagerFile() {
			this.fileList = await this.Manager.File.query();

			if (this.fileList.length > 0) {
				this.dateAs = this.fileList.slice(0).sort((fileA, fileB) => {
					return fileA.plan.dateAs - fileB.plan.dateAs;
				})[0].plan.dateAs;
			}
		}
	},
	async mounted() {
		await this.getManagerFile();
	}
};
</script>

<style lang="scss">
#manager-customer-table {
	.col-total {
		width: 10em;
		text-align: right;
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
