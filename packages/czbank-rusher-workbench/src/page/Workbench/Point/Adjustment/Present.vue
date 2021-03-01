<template>

<div style="min-height: 1000px">
	<h1>{{ $t('menu.point.adjustment.present.label') }}</h1><hr>

	<customer-point-selector
		ref="customer-selector"
		@select="selectedCustomer = $event"
	/>

	<h3 class="mt-3">可用的{{ $t('c.present.className') }}</h3>
	<b-table
		head-variant="light"
		id="present-table"
		class="mt-3"
		ref="present-table"
		:fields="fieldListOfPresent"
		:items="itemListOfPresent"
		small
		hover
		bordered
		selectable
		select-mode="single"
		show-empty
		@row-selected="selectPresent"
	>
		<template #empty>
			<div>没有可用的礼物。请<b-link
				:to="{ name: 'workbench.present.register' }"
				class="mx-1"
			>创建</b-link>或<b-link
				:to="{ name: 'workbench.present.overview' }"
				class="mx-1"
			>启用</b-link></div>
		</template>

		<template #cell(price)="{ item }">
			{{ item.price | numeralFloat }}￥
		</template>
	</b-table>

	<b-button-toolbar>
		<b-form-group
			class="mb-0 mr-1"
			label="客户"
		>
			<b-form-input
				:value="selectedCustomer.name"
				style="width:9em"
				readonly
				placeholder="在上方选择客户"
			/>
		</b-form-group>
		<b-form-group
			class="mb-0 mr-1"
			:label="$t('c.present.className')"
		>
			<b-form-input
				:value="selectedPresent.name"
				style="width:16em"
				readonly
				placeholder="在上方选择礼品"
			/>
		</b-form-group>
		<b-form-group
			class="mb-0 mr-1"
			label="数量"
		>
			<b-form-input
				type="number"
				v-model="form.amount"
				style="width:6em"
				number
			/>
		</b-form-group>

		<b-form-group
			class="mb-0 mr-1 flex-grow-1"
			label="描述"
		>
			<b-form-input
				v-model="form.description"
			/>
		</b-form-group>

	</b-button-toolbar>

	<div class="text-center">
		<b-button
			class="mt-4 w-25 mx-auto"
			size="md"
			variant="primary"
			@click="createPresentExchange"
			:disabled="!isValid || !isPointEnough"
		>兑换</b-button>
		<p v-show="isValid && !isPointEnough">该用户积分不足</p>
	</div>
</div>

</template>

<script>
export default {
	data() {
		return {
			Present: {
				list: [],
				selectedId: null
			},
			form: {
				amount: 1,
				description: ''
			},
			selectedCustomer: {}
		};
	},
	methods: {
		selectPresent(rows) {
			this.Present.selectedId = rows.length ? rows[0].id : null;
		},
		async getPresentList() {
			this.Present.list = await this.$rusher.backend.Present.query();
		},
		async createPresentExchange() {
			await this.$rusher.backend.Point.Present.create({
				amount: this.form.amount,
				description: this.form.description,
				customerId: this.selectedCustomer.id,
				presentId: this.selectedPresent.id
			});

			await this.$bvModal.msgBoxOk('兑换成功', {
				title: '提示',
				okTitle: '知道了',
				okVariant: 'success',
				centered: true
			});

			this.$refs['customer-selector'].refresh();
			this.getPresentList();
		}
	},
	computed: {
		isValid() {
			return this.selectedCustomer.id &&
				this.selectedPresent.id &&
				this.form.amount > 0;
		},
		isPointEnough() {
			return this.form.amount * this.selectedPresent.point < this.selectedCustomer.point;
		},
		selectedPresent() {
			if (this.Present.selectedId === null) {
				return { name: '' };
			}

			return this.Present.list.find(present => present.id === this.Present.selectedId);
		},
		fieldListOfPresent() {
			return [
				{ key: 'name', label: '名称', class: 'col-short-string' },
				{ key: 'point', label: '积分单价', sortable: true, class: 'col-short-number' },
				{ key: 'price', label: '采购单价', sortable: true, class: 'col-short-number' },
				{ key: 'usageCount', label: '已送出', sortable: true, class: 'col-short-number' },
				{ key: 'blank', label: '', class: 'col-auto-blank' }
			];
		},
		itemListOfPresent() {
			return this.Present.list.map(present => {
				return {
					id: present.id,
					name: present.name,
					point: present.point,
					price: present.price,
					usageCount: present.usageCount
				};
			});
		},
	},
	async mounted() {
		this.getPresentList();
	}
};
</script>

<style>

</style>
