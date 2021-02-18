<template>

<div>
	<h1>{{ $t('menu.point.adjustment.present.label') }}</h1><hr>

	<div style="min-height: 365px">
		<b-form-row>
			<b-col cols="auto">
				<h3>客户</h3>
				<b-input-group
					prepend="过滤"
					class="mr-auto"
					size="sm"
				>
					<b-form-input
						v-model="CustomerPoint.keyword"
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
					:filter="CustomerPoint.keyword"
					@row-selected="selectCustomer"
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

	<h3 class="mt-3">可用的{{ $t('c.present.className') }}</h3>
	<b-table
		id="present-table"
		class="mt-3"
		ref="present-table"
		:fields="fieldListOfPresent"
		:items="itemListOfPresent"
		small
		hover
		bordered
		selectable
		select-mode="single"
		show-empty
		@row-selected="selectPresent"
	>
		<template #empty>
			<div>没有可用的礼物。请<b-link
				:to="{ name: 'workbench.present.register' }"
				class="mx-1"
			>创建</b-link>或<b-link
				:to="{ name: 'workbench.present.overview' }"
				class="mx-1"
			>启用</b-link></div>
		</template>

		<template #cell(price)="{ item }">
			{{ item.price | numeralFloat }}￥
		</template>
	</b-table>

	<b-button-toolbar>
		<b-form-group
			class="mb-0 mr-1"
			label="客户"
		>
			<b-form-input
				:value="selectedCustomer.name"
				style="width:9em"
				readonly
				placeholder="在上方选择客户"
			/>
		</b-form-group>
		<b-form-group
			class="mb-0 mr-1"
			:label="$t('c.present.className')"
		>
			<b-form-input
				:value="selectedPresent.name"
				style="width:16em"
				readonly
				placeholder="在上方选择礼品"
			/>
		</b-form-group>
		<b-form-group
			class="mb-0 mr-1"
			label="数量"
		>
			<b-form-input
				type="number"
				v-model="form.amount"
				style="width:6em"
				number
			/>
		</b-form-group>

		<b-form-group
			class="mb-0 mr-1 flex-grow-1"
			label="描述"
		>
			<b-form-input
				v-model="form.description"
			/>
		</b-form-group>

	</b-button-toolbar>
	<div class="text-center">
		<b-button
			class="mt-4 w-25 mx-auto"
			size="md"
			variant="primary"
			@click="createPresentExchange"
		>兑换</b-button>
	</div>
</div>

</template>

<script>
export default {
	data() {
		return {
			Present: {
				list: [],
				selectedId: null
			},
			form: {
				amount: 1,
				description: ''
			},
			CustomerPoint: {
				list: [],
				keyword: '',
				page: { per: 10, total: 100, current: 1 },
				selectedId: null
			},
			Performance: {
				list: []
			}
		};
	},
	watch: {
		'CustomerPoint.selectedId'(value) {
			if (value === null) {
				this.Performance.list = [];
			} else {
				this.getCustomerPerformanceList();
			}
		}
	},
	methods: {
		selectCustomer(rows) {
			this.CustomerPoint.selectedId = rows.length ? rows[0].id : null;
		},
		selectPresent(rows) {
			this.Present.selectedId = rows.length ? rows[0].id : null;
		},
		async getCustomerPointList() {
			this.CustomerPoint.list = await this.$rusher.backend.Point.query();
		},
		async getPresentList() {
			this.Present.list = await this.$rusher.backend.Present.query();
		},
		async getCustomerPerformanceList() {
			this.Performance.list = await this.$rusher.backend.Customer.Performance.query({
				customerId: this.CustomerPoint.selectedId
			});
		},
		async createPresentExchange() {
			await this.$rusher.backend.Point.Present.create({
				amount: this.form.amount,
				description: this.form.description,
				customerId: this.selectedCustomer.id,
				presentId: this.selectedPresent.id
			});

			await this.$bvModal.msgBoxOk('兑换成功', {
				title: '提示',
				okTitle: '知道了',
				okVariant: 'success',
				centered: true
			});

			this.getCustomerPointList();
			this.getPresentList();
		}
	},
	computed: {
		selectedCustomer() {
			if (this.CustomerPoint.selectedId === null) {
				return { name: '' };
			}

			return this.CustomerPoint.list
				.find(customerPoint => customerPoint.id === this.CustomerPoint.selectedId);
		},
		selectedPresent() {
			if (this.Present.selectedId === null) {
				return { name: '' };
			}

			return this.Present.list.find(present => present.id === this.Present.selectedId);
		},
		fieldListOfCustomerPoint() {
			return [
				{ key: 'name', label: '名称', class: 'col-short-string' },
				{ key: 'point', label: '积分余额', sortable: true, class: 'col-short-number' },
			];
		},
		fieldListOfPresent() {
			return [
				{ key: 'name', label: '名称', class: 'col-short-string' },
				{ key: 'point', label: '积分单价', sortable: true, class: 'col-short-number' },
				{ key: 'price', label: '采购单价', sortable: true, class: 'col-short-number' },
				{ key: 'usageCount', label: '已送出', sortable: true, class: 'col-short-number' },
				{ key: 'blank', label: '', class: 'col-blank' }
			];
		},
		itemListOfCustomerPoint() {
			return this.CustomerPoint.list.map(customerPoint => {
				return {
					id: customerPoint.id,
					name: customerPoint.name,
					point: customerPoint.point
				};
			});
		},
		itemListOfPresent() {
			return this.Present.list.map(present => {
				return {
					id: present.id,
					name: present.name,
					point: present.point,
					price: present.price,
					usageCount: present.usageCount
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
			return this.Performance.list.map(performance => {
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
	mounted() {
		this.getCustomerPointList();
		this.getPresentList();
	}
};
</script>

<style>

</style>
