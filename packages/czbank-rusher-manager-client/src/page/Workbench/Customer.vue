<template>

<div
	class="py-3 d-flex flex-column h-100"
>
	<b-form-input
		v-model="keyword"
		placeholder="请输入名字查找客户"
		name="customer-name-keyword"
		v-if="!hasCurrentCustomer"
	/>

	<b-form-input
		:value="currentCustomerName"
		readonly
		v-if="hasCurrentCustomer"
	/>

	<div
		v-if="currentCustomer === null"
		class="mt-3 flex-grow-1 overflow-auto"
	>
		<div
			class="text-center h-100"
			v-show="customerList.length === 0"
		>
			<p>没有找到符合要求的客户</p>
		</div>

		<div class="w-100 overflow-hidden">
			<b-form-row>
				<b-col
					cols="6"
					v-for="customer in customerList"
					:key="customer.id"
					class="mb-2 customer-button"
				>
					<b-button
						size="lg"
						class="text-center w-100"
						:variant="selectedCustomer.id === customer.id ? 'success' : 'secondary'"
						@click="selected = customer"
					>
						<h4><b>{{ customer.name }}</b></h4>
						<p
							class="m-0"
						><small>{{ customer.code }}</small></p>
					</b-button>
				</b-col>
			</b-form-row>
		</div>
	</div>

	<div
		v-if="currentCustomer !== null"
		class="mt-3 flex-grow-1 overflow-auto"
	>
		用户业绩
	</div>

	<b-button
		class="mt-3"
		variant="success"
		:disabled="selected === null"
		@click="setCurrentCustomer"
		v-if="!hasCurrentCustomer"
	>确认选择该客户作为<b class="mx-1">当前客户</b>并查看</b-button>

	<b-button
		class="mt-3"
		variant="danger"
		v-if="hasCurrentCustomer"
		@click="resetCurrentCustomer"
	>重新选择客户</b-button>
</div>

</template>

<script>
import customer from './customer';

export default {
	data() {
		return {
			keyword: '',
			customerList: [],
			performanceList: [],
			selected: null
		};
	},
	watch: {
		keyword(value) {
			if (value === '') {
				this.customerList = [];
			} else {
				this.getCustomerList();
			}
		}
	},
	methods: {
		async getCustomerList() {
			this.customerList = await this.$manager.backend.Customer.query({
				name: this.keyword
			});
		},
		resetSelection() {
			this.selected = null;
			this.keyword = '';
			this.customerList = [];
		},
		resetCurrentCustomer() {
			this.$store.commit('setCustomer', null);
			this.resetSelection();
		},
		async setCurrentCustomer() {
			await this.getCustomerById(this.selected.id);
			this.$store.commit('setCustomer', this.selected.id);
			this.resetSelection();
		}
	},
	computed: {
		selectedCustomer() {
			return this.selected === null ? {} : this.selected;
		}
	},
	mixins: [customer]
};
</script>

<style lang="scss">
.customer-button {
	small {
		font-size: 12px;
	}
}
</style>
