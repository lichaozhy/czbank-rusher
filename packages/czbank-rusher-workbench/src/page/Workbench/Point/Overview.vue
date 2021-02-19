<template>

<div>
	<h1>积分总览</h1><hr>
	<customer-point-selector
		ref="customer-selector"
		@select="selectedCustomer = $event"
	/>
	<h2>积分操作日志</h2>
	<b-table
		class="mt-3"
		hover
		:fields="fieldListOfPointAdjustment"
		:items="itemListOfPointAdjustment"
		small
		bordered
		head-variant="light"
		ref="adjustment-table"
		empty-text="选择一个客户以查看他的积分变动"
		show-empty
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
			selectedCustomer: {}
		};
	},
	watch: {
		selectedCustomer() {
			this.getPointAdjustmentListByCustomer();
		}
	},
	methods: {
		async getPointAdjustmentListByCustomer() {
			this.listOfPointAdjustment = this.selectedCustomer.id
				? await this.$rusher.backend.Point.Adjustment.query({
					customerId: this.selectedCustomer.id
				}) : [];
		}
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
	}
};
</script>

<style>

</style>
