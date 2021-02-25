<template>

<div
	class="py-3 d-flex flex-column h-100"
>
	<b-form-input
		:value="currentCustomerName"
		readonly
		placeholder="请到找客户面板设置当前客户"
		@click="jumpToCustomer"
	/>

	<div
		class="mt-3 flex-grow-1 overflow-auto"
	>
		<b-form-group
			label="选择奖品"
		>
			<b-form-select
				:options="optionListOfActivity"
				v-model="form.presentId"
				:disabled="!hasCurrentCustomer"
			></b-form-select>
		</b-form-group>

		<b-table
			:fields="fieldListOfPresent"
			:items="[selectedPresent]"
			stacked
			small
		>
			<template
				#cell(price)="{ item }"
			><span
				v-if="item.id"
			>{{ item.price | numeralFloat }} 元</span></template>

			<template
				#cell(createdAt)="{ item }"
			><span
				v-if="item.id"
			>{{ item.createdAt | localDatetime }}</span></template>
		</b-table>

		<b-form-group
			label="兑换数量"
			class="overflow-hidden"
		>
			<b-form-row>
				<b-col>
					<b-form-input
						name="activity-reward-point"
						v-model="form.amount"
						class="text-center"
						number
						type="number"
						autocomplete="off"
						:disabled="!hasCurrentCustomer"
					/>
				</b-col>
				<b-col cols="auto">
					<b-button-group>
						<b-button
							v-for="amount in [1, 2, 5, 10]"
							:key="amount"
							variant="success"
							@click="form.amount = amount"
							:disabled="form.amount === amount || !hasCurrentCustomer"
							style="width: 3em"
						>{{ amount }}</b-button>
					</b-button-group>
				</b-col>
			</b-form-row>
		</b-form-group>

		<b-form-group
			label="备注"
		>
			<b-form-textarea
				style="height: 6em"
				name="activity-reward-description"
				v-model="form.description"
				:disabled="!hasCurrentCustomer"
			/>
		</b-form-group>

		<p
			v-if="form.presentId !== null && currentCustomer !== null"
			class="text-center"
		>当前积分<b
			class="mx-1"
		>{{ currentCustomer.point }}</b>点，需要消耗<b
			class="mx-1"
		>{{ form.amount * selectedPresent.point }}</b></p>
	</div>

	<b-button
		class="mt-3"
		variant="danger"
		size="lg"
		:disabled="!isValid"
		@click="createPresentExchange"
	>确定兑换礼品</b-button>
</div>

</template>

<script>
import customer from './mixin/customer';
import point from './mixin/point';

export default {
	name: 'Workbench.Present',
	data() {
		return {
			presentList: [],
			form: {
				presentId: null,
				amount: 1,
				description: ''
			}
		};
	},
	watch: {
		'form.amount'(value) {
			if (value < 1 || typeof value === 'string') {
				this.$nextTick(() => { this.form.amount = 1; });
			}
		}
	},
	computed: {
		isValid() {
			return this.form.amount > 0 &&
				this.form.presentId !== null &&
				this.form.amount * this.selectedPresent.point < this.currentCustomer.point &&
				this.hasCurrentCustomer;
		},
		selectedPresent() {
			return this.presentList
				.find(present => present.id === this.form.presentId) || {};
		},
		optionListOfActivity() {
			const list = this.presentList.map(present => {
				return { value: present.id, text: present.name };
			});

			return [{ value: null, text: '请选择礼品' }].concat(list);
		},
		fieldListOfPresent() {
			return [
				{ key: 'name', label: '礼品名称' },
				{ key: 'price', label: '价格' },
				{ key: 'point', label: '消耗积分点数' },
				{ key: 'description', label: '描述' },
				{ key: 'createdAt', label: '登记时间' }
			];
		}
	},
	methods: {
		resetForm() {
			this.form = {
				presentId: null,
				amount: 1,
				description: ''
			};
		},
		async getPresentList() {
			this.presentList = await this.$manager.backend.Present.query();
		},
		async createPresentExchange() {
			await this.$manager.backend.Present.exchange({
				customerId: this.currentCustomer.id,
				presentId: this.form.presentId,
				amount: this.form.amount,
				description: this.form.description
			});

			await this.$bvModal.msgBoxOk('兑换成功', {
				title: '提示',
				centered: true,
				okTitle: '知道了'
			});

			this.getCustomerById(this.currentCustomerId);
			this.resetForm();
		}
	},
	mixins: [customer, point],
	mounted() {
		this.getPresentList();
	}
};
</script>

<style>

</style>
