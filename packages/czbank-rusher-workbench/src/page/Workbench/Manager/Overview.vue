<template>

<div>
	<h1>客户经理总览</h1><hr>

	<b-button-toolbar>
		<b-input-group
			prepend="过滤"
			class="mr-auto"
			size="sm"
		>
			<b-form-input
				v-model="keyword"
				:placeholder="`${$t('c.manager.name')} / ${$t('c.manager.code')}`"
			/>
		</b-input-group>

		<b-button
			variant="primary"
			class="mr-auto"
			:disabled="selectedManagerId === null"
			:to="{
				name: 'workbench.manager.detail',
				params: { managerId: selectedManagerId }
			}"
		><b-icon-person-fill
			class="mr-2"
		/>查看客户经理</b-button>

		<b-button
			class="mr-0"
			variant="danger"
			:disabled="!isDeletable"
			@click="deleteManager(selectedManagerId)"
		><b-icon-person-dash-fill
			class="mr-2"
		/>{{ $t('c.base.delete') }}</b-button>
	</b-button-toolbar>

	<b-table
		id="manager-overview-table"
		class="mt-3"
		:fields="managerTableField"
		:items="managerItemList"
		:filter="keyword"
		bordered
		small
		selectable
		select-mode="single"
		@row-selected="selectManager($event)"
		@row-dblclicked="gotoManager($event.id)"
	>
		<template #cell(average)="row">
			{{ row.item.average | numeralFloat }}
		</template>

		<template #cell(balance)="row">
			{{ row.item.balance | numeralFloat }}
		</template>

		<template #cell(contribution)="row">
			{{ row.item.contribution.toFixed(0) }}
		</template>

		<template #cell(depositRate)="row">
			{{ (row.item.depositRate * 100).toFixed(2) + '%' }}
		</template>

		<template #cell(depositAverage)="row">
			{{ row.item.depositAverage | numeralFloat }}
		</template>

		<template #cell(depositBalance)="row">
			{{ row.item.depositBalance | numeralFloat }}
		</template>

		<template #cell(nonDepositAverage)="row">
			{{ row.item.nonDepositAverage | numeralFloat }}
		</template>

		<template #cell(nonDepositBalance)="row">
			{{ row.item.nonDepositBalance | numeralFloat }}
		</template>

	</b-table>
</div>

</template>

<script>
import Matrix from './Detail/matrix';

export default {
	data() {
		return {
			keyword: '',
			managerList: [],
			selectedManagerId: null
		};
	},
	computed: {
		isDeletable() {
			if (this.selectedManagerId === null) {
				return false;
			}

			const manager = this.managerList.find(manager => {
				return manager.id === this.selectedManagerId;
			});

			return manager.customerNumber === 0;
		},
		managerTableField() {
			return [
				{
					key: 'name',
					label: this.$t('c.manager.name'),
					class: 'col-manager-name',
					sortable: true
				},
				{
					key: 'code',
					label: this.$t('c.manager.code'),
					class: 'col-manager-code',
					sortable: true
				},
				{
					key: 'customerNumber',
					label: this.$t('c.manager.customerNumber'),
					class: 'col-matrix',
					sortable: true,
				},
				{
					key: 'average',
					label: '金融资产日均',
					sortable: true,
					class: 'col-matrix'
				},
				{
					key: 'balance',
					label: '金融资产余额',
					sortable: true,
					class: 'col-matrix'
				},
				{
					key: 'contribution',
					label: '贡献度',
					sortable: true,
					class: 'col-matrix'
				},
				{
					key: 'depositRate',
					label: '存款占比',
					sortable: true,
					class: 'col-matrix'
				},
				{
					key: 'depositAverage',
					label: '存款日均',
					sortable: true,
					class: 'col-matrix'
				},
				{
					key: 'depositBalance',
					label: '存款余额',
					sortable: true,
					class: 'col-matrix'
				},
				{
					key: 'nonDepositAverage',
					label: '非存款日均',
					sortable: true,
					class: 'col-matrix'
				},
				{
					key: 'nonDepositBalance',
					label: '非存款余额',
					sortable: true,
					class: 'col-matrix'
				},
				{
					key: 'lastUploadedDateAs',
					label: '最新时点',
					class: 'col-last-upload',
					sortable: true
				},
				{
					key: 'blank',
					label: '',
					class: 'col-blank',
				}
			];
		},
		managerItemList() {
			return this.managerList.map(manager => {
				const matrix = Matrix(manager.abstract);

				return {
					id: manager.id,
					name: manager.name,
					code: manager.code,
					customerNumber: manager.customerNumber,
					average: matrix.average,
					balance: matrix.balance,
					contribution: matrix.contribution,
					depositRate: matrix.depositRate,
					depositAverage: matrix.deposit.average,
					depositBalance: matrix.deposit.balance,
					nonDepositAverage: matrix.nonDeposit.average,
					nonDepositBalance: matrix.nonDeposit.balance,
					lastUploadedDateAs: manager.lastUploadedDateAs
				};
			});
		}
	},
	methods: {
		selectManager(rows) {
			this.selectedManagerId = rows.length > 0 ? rows[0].id : null;
		},
		async getManagerList() {
			this.managerList = await this.$rusher.backend.Manager.query();
		},
		async deleteManager(managerId) {
			this.selectedManagerId = null;
			await this.$rusher.backend.Manager(managerId).delete();
			await this.getManagerList();
		},
		async gotoManager(managerId) {
			await this.$router.push({
				name: 'workbench.manager.detail',
				params: { managerId }
			});
		}
	},
	mounted() {
		this.getManagerList();
	}
};
</script>

<style lang="scss">
#manager-overview-table {
	.col-last-upload {
		width: 8em;
	}

	.col-matrix {
		width: 8em;
		text-align: right;
	}
}
</style>
