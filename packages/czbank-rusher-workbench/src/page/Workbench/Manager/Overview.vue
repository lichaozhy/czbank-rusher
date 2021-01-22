<template>

<div>
	<h1>客户经理总览</h1><hr>

	<b-button-toolbar>
		<b-input-group
			prepend="过滤"
			class="mr-auto"
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
		class="mt-3"
		:fields="managerTableField"
		:items="managerItemList"
		:filter="keyword"
		bordered
		small
		selectable
		select-mode="single"
		@row-selected="selectManager($event)"
	></b-table>
</div>

</template>

<script>
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
					class: 'col-manager-customerNumber',
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
				return {
					id: manager.id,
					name: manager.name,
					code: manager.code,
					customerNumber: manager.customerNumber
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
		}
	},
	mounted() {
		this.getManagerList();
	}
};
</script>

<style>

</style>
