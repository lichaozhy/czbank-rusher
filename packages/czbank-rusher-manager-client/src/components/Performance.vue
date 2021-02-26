<template>

<div>
	<b-card
		v-if="items.length === 0"
		no-body
	>
		<b-card-header class="p-1">
			<b-button
				block
				variant="primary"
				disabled
			>没有时点数据</b-button>
		</b-card-header>
	</b-card>

	<b-card
		v-for="(performance, index) in items"
		:key="performance.id"
		no-body
	>
		<b-card-header class="p-1">
			<b-button
				block
				v-b-toggle="`accordion-${index}`"
				variant="primary"
			>{{ performance.dateAs }} 贡献度：{{ performance.contribution.value }}</b-button>
		</b-card-header>
		<b-collapse
			:id="`accordion-${index}`"
			accordion="performance"
		>
			<b-list-group flush>
				<b-list-group-item
					class="d-flex justify-content-between align-items-center"
				><b>金融资产余额：</b><span

				>{{ performance.contribution.balance | numeralFloat }}</span></b-list-group-item>
				<b-list-group-item
					class="d-flex justify-content-between align-items-center"
				><b>金融资产日均：</b><span

				>{{ performance.contribution.average | numeralFloat }}</span></b-list-group-item>
				<b-list-group-item
					class="d-flex justify-content-between align-items-center"
				>存款余额：<span
				>{{ performance.contribution.deposit.balance | numeralFloat }}</span></b-list-group-item>
				<b-list-group-item
					class="d-flex justify-content-between align-items-center"
				>存款日均：<span
				>{{ performance.contribution.deposit.average | numeralFloat }}</span></b-list-group-item>
				<b-list-group-item
					class="d-flex justify-content-between align-items-center"
				>非存款余额：<span
				>{{ performance.contribution.other.balance | numeralFloat }}</span></b-list-group-item>
				<b-list-group-item
					class="d-flex justify-content-between align-items-center"
				>非存款日均：<span
				>{{ performance.contribution.other.average | numeralFloat }}</span></b-list-group-item>
			</b-list-group>
		</b-collapse>
	</b-card>
</div>

</template>

<script>
export default {
	props: {
		items: {
			type: Array,
			required: true
		}
	}
};
</script>
