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

		<div class="w-100 h-100 overflow-hidden">
			<b-form-row
				class="justify-content-center align-items-center overflow-auto h-100"
			>
				<b-col
					cols="6"
					v-for="customer in customerList"
					:key="customer.id"
					class="mb-2"
				>
					<b-button
						size="lg"
						class="text-center w-100 customer-button"
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
		<b-table
			stacked="sm"
			:fields="fieldListOfCustomer"
			:items="[currentCustomer]"
			head-variant="light"
			small
			bordered
		>
			<template
				#cell(age)="{item}"
			>{{ item.age ? item.age : '不详' }}</template>

			<template
				#cell(gender)="{item}"
			>{{ item.gender ? item.gender : '不详' }}</template>

			<template
				#cell(mobilePhone)="{item}"
			>{{ item.mobilePhone ? item.mobilePhone : '不详' }}</template>
		</b-table>

		<div class="w-100 overflow-auto accordion">
			<b-card
				v-for="(performance, index) in itemListOfPerformance"
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
	name: 'Workbench.Customer',
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
		},
		async currentCustomer(value) {
			this.performanceList = value === null
				? []
				: await this.getCurrentCustomerPerformanceList();
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
			this.$store.commit('setCustomer', this.selected.id);
			this.resetSelection();
		},
		async getCurrentCustomerPerformanceList() {
			return this.$manager.backend.Customer(this.currentCustomerId).Performance.query();
		}
	},
	computed: {
		selectedCustomer() {
			return this.selected === null ? {} : this.selected;
		},
		fieldListOfCustomer() {
			return [
				{ key: 'age', label: '年龄' },
				{ key: 'gender', label: '性别' },
				{ key: 'mobilePhone', label: '手机号' },
				{ key: 'code', label: '客户号' },
				{ key: 'point', label: '积分余额' }
			];
		},
		itemListOfPerformance() {
			return this.performanceList.slice(0)
				.sort((a, b) => b.dateAs > a.dateAs ? 1 : -1);
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

.accordion {
	> .card {
		overflow:hidden

		&:not(:last-of-type) {
			border-bottom:0;
		}

		> .card-header {
			margin-bottom: 0px
		}
	}
}
</style>