<template>

<div
	class="py-3 d-flex flex-column h-100"
>
	<app-performance
		:items="itemListOfPerformance"
		class="w-100 overflow-auto accordion"
	/>
</div>

</template>

<script>
export default {
	data() {
		return {
			performanceList: []
		};
	},
	computed: {
		itemListOfPerformance() {
			return this.performanceList.slice(0)
				.sort((a, b) => b.dateAs > a.dateAs ? 1 : -1);
		}
	},
	methods: {
		async getManagerPerformanceList() {
			this.performanceList = await this.$manager.backend.Manager.Performance.query();
		}
	},
	mounted() {
		this.getManagerPerformanceList();
	}
};
</script>

<style>

</style>
