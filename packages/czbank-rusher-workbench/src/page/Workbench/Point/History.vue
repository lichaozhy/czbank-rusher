<template>

<div>
	<h1>积分操作历史</h1><hr>

	<b-button-toolbar>
		<b-input-group
			prepend="过滤"
			class="mr-auto"
			size="sm"
		>
			<b-form-input
				v-model="filter.keyword"
				placeholder="搜索客户"
				lazy
				name="manager-customer-search"
				style="width: 8em"
			/>
		</b-input-group>

    <b-pagination
			class="m-0"
      v-model="page.current"
      :total-rows="page.total"
      :per-page="page.per"
      aria-controls="my-table"
			size="sm"
    ></b-pagination>
	</b-button-toolbar>

	<b-table
		class="mt-3"
		hover
		:fields="fieldListOfPointAdjustment"
		:items="itemListOfPointAdjustment"
		small
		bordered
		head-variant="light"
		:per-page="page.per"
		:filter="filter.keyword"
		@filtered="updateLength"
		:current-page="page.current"
		ref="adjustment-table"
	>
		<template #cell(createdAt)="{ item }">
			{{ item.createdAt | localDatetime }}
		</template>
	</b-table>
</div>

</template>

<script>
export default {
	data() {
		return {
			listOfPointAdjustment: [],
			page: { per: 20, current: 1, total: 100 },
			filter: {
				keyword: ''
			}
		};
	},
	methods: {
		async getPointAdjustmentList() {
			this.listOfPointAdjustment = await this.$rusher.backend.Point.Adjustment.query();
			this.page.total = this.listOfPointAdjustment.length;
		},
		updateLength() {
			this.page.total = this.$refs['adjustment-table'].filteredItems.length;
		},
	},
	computed: {
		fieldListOfPointAdjustment() {
			return [
				{ key: 'customerName', label: '姓名', class: 'col-short-string' },
				{ key: 'customerCode', label: '份证号', class: 'col-string' },
				{ key: 'type', label: '操作类型', sortable: true, class: 'col-short-string' },
				{ key: 'value', label: '偏移量', sortable: true, class: 'col-short-number' },
				{ key: 'createdAt', label: '操作于', sortable: true, class: 'col-datetime' },
				{ key: 'blank', label: '' },
			];
		},
		itemListOfPointAdjustment() {
			const map = this.$rusher.enum.ADJUSTMENT.TYPE;

			return this.listOfPointAdjustment.map(adjustment => {
				return {
					id: adjustment.id,
					customerName: adjustment.customer.name,
					customerCode: adjustment.customer.code,
					type: map[adjustment.type],
					value: adjustment.value,
					createdAt: adjustment.createdAt
				};
			});
		}
	},
	mounted() {
		this.getPointAdjustmentList();
	}
};
</script>

<style>

</style>
