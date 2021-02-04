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
		<template #cell(average)="{ item }">
			<span
				v-if="item.average !== null"
			>{{ item.average | numeralFloat }}</span>
			<span v-if="item.average === null">-</span>
		</template>

		<template #cell(balance)="{ item }">
			<span
				v-if="item.average !== null"
			>{{ item.balance | numeralFloat }}</span>
			<span v-if="item.average === null">-</span>
		</template>

		<template #cell(contribution)="{ item }">
			<span
				v-if="item.contribution !== null"
			>{{ item.contribution.toFixed(0) }}</span>
			<span v-if="item.contribution === null">-</span>
		</template>

		<template #cell(depositRate)="{ item }">
			<span
				v-if="item.depositRate !== null"
			>{{ (item.depositRate * 100).toFixed(2) + '%' }}</span>
			<span v-if="item.depositRate === null">-</span>
		</template>

		<template #cell(depositAverage)="{ item }">
			<span
				v-if="item.depositAverage !== null"
			>{{ item.depositAverage | numeralFloat }}</span>
			<span v-if="item.depositAverage === null">-</span>
		</template>

		<template #cell(depositBalance)="{ item }">
			<span
				v-if="item.depositBalance !== null"
			>{{ item.depositBalance | numeralFloat }}</span>
			<span v-if="item.depositBalance === null">-</span>
		</template>

		<template #cell(nonDepositAverage)="{ item }">
			<span
				v-if="item.nonDepositAverage !== null"
			>{{ item.nonDepositAverage | numeralFloat }}</span>
			<span v-if="item.nonDepositAverage === null">-</span>
		</template>

		<template #cell(nonDepositBalance)="{ item }">
			<span
				v-if="item.nonDepositBalance !== null"
			>{{ item.nonDepositBalance | numeralFloat }}</span>
			<span v-if="item.nonDepositBalance === null">-</span>
		</template>

		<template #cell(customerNumber)="{ item }">
			<span
				v-if="item.customerNumber !== null"
			>{{ item.customerNumber | numeral }}</span>
			<span v-if="item.customerNumber === null">-</span>
		</template>

		<template #cell(lastDateAs)="{ item }">
			<span
				v-if="item.lastDateAs !== null"
			>{{ item.lastDateAs | numeral }}</span>
			<b-link
				:to="{ name: 'workbench.database.account-data-plan' }"
			><em v-if="item.lastDateAs === null">上传报表</em></b-link>
		</template>

	</b-table>
</div>

</template>

<script>
export default {
	data() {
		return {
			keyword: '',
			managerPreviewList: [],
			selectedManagerId: null
		};
	},
	computed: {
		isDeletable() {
			if (this.selectedManagerId === null) {
				return false;
			}

			const preview = this.managerPreviewList.find(preview => {
				return preview.manager.id === this.selectedManagerId;
			});

			return preview.customerNumber === null;
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
					key: 'lastDateAs',
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
			return this.managerPreviewList.map(preview => {
				const { manager, contribution } = preview;

				return {
					id: manager.id,
					name: manager.name,
					code: manager.code,
					average: contribution.average,
					balance: contribution.balance,
					contribution: contribution.value,
					depositRate: contribution.rate,
					depositAverage: contribution.deposit.average,
					depositBalance: contribution.deposit.balance,
					nonDepositAverage: contribution.other.average,
					nonDepositBalance: contribution.other.balance,
					customerNumber: preview.customerNumber,
					lastDateAs: preview.lastDateAs
				};
			});
		}
	},
	methods: {
		selectManager(rows) {
			this.selectedManagerId = rows.length > 0 ? rows[0].id : null;
		},
		async getManagerList() {
			this.managerPreviewList = await this.$rusher.backend.Manager.Preview.query();
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
