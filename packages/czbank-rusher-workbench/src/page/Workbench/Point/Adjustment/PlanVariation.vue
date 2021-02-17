<template>

<div>
	<h1>{{ $t('menu.point.adjustment.planVariation.label') }}</h1><hr>
	<ul class="list-unstyled">
		<li>贡献度降低的客户，将不被累积积分</li>
		<li>符合要求的用户将被追加<code
			class="mx-1"
		>point = Contribution<sub>target</sub> - Contribution<sub>base</sub></code>个积分</li>
	</ul>

	<h2>发放历史</h2>
	<b-table
		:items="itemListOfBatch"
		:fields="fieldListOfBatch"
		small
		bordered
		hover
		select-mode="single"
		selectable
	>
		<template #cell(createdAt)="row">
			{{ row.item.createdAt | localDatetime }}
		</template>
	</b-table>

	<h2 class="mt-3">创建批处理</h2>
	<ul class="list-unstyled">
		<li>必须在预览结果之后，才能创建新批处理</li>
	</ul>

	<b-form>
		<b-button-toolbar justify>
			<b-form-group
				class="mb-0 mr-1"
				label="基础时点"
			>
				<b-form-select
					style="width: 10em"
					name="present-name"
					:disabled="planList.length === 0"
					v-model="form.planId.base"
					:options="dateAsOptionList"
					@change="resetPreviewList"
				/>
			</b-form-group>

			<b-form-group
				class="mb-0 mr-1"
				label="目标时点"
			>
				<b-form-select
					style="width: 10em"
					name="present-name"
					:disabled="planList.length === 0"
					v-model="form.planId.target"
					:options="dateAsOptionList"
					@change="resetPreviewList"
				/>
			</b-form-group>

			<b-form-group
				class="mb-0 mr-1 flex-grow-1"
				style="width: 20em"
				label="描述"
			>
				<b-form-input
					name="present-name"
					v-model="form.description"
				/>
			</b-form-group>

			<b-button
				class="mr-1 align-self-end"
				variant="primary"
				@click="getPreviewList"
				:disabled="!isFormValid || Preview.pending"
			>预览结果</b-button>

			<b-button
				class="mr-0 align-self-end"
				variant="success"
				:disabled="!isFormValid || !Preview.pending"
				@click="createBatch"
			>确定并创建</b-button>
		</b-button-toolbar>
	</b-form>
	<h3 class="mt-3">受影响的客户</h3>

	<b-button-toolbar class="mb-3">
		<b-input-group
			prepend="过滤"
			class="mr-auto"
			size="sm"
		>
			<b-form-input
				v-model="Preview.filter.keyword"
				placeholder="搜索客户"
				lazy
				name="manager-customer-search"
				style="width: 8em"
				:disabled="!Preview.pending"
			/>
		</b-input-group>

		<b-pagination
			class="m-0"
			v-model="Preview.page.current"
			:total-rows="Preview.page.total"
			:per-page="Preview.page.per"
			aria-controls="my-table"
			:disabled="!Preview.pending"
			size="sm"
		></b-pagination>
	</b-button-toolbar>

	<b-table
		:items="itemListOfPreview"
		:fields="fieldListOfPreview"
		small
		bordered
		hover
		select-mode="single"
		selectable
		:per-page="Preview.page.per"
		:current-page="Preview.page.current"
		:filter="Preview.filter.keyword"
		ref="preview-table"
		@filtered="updatePreviewPageTotal"
		show-empty
	>
		<template #thead-top>
			<b-tr>
				<b-th></b-th>
				<b-th colspan="3" class="text-center">积分情况</b-th>
				<b-th class="text-center">基础业绩</b-th>
				<b-th colspan="5" class="text-center">目标业绩</b-th>
				<b-th></b-th>
			</b-tr>
		</template>

		<template #cell(variation)="row">
			{{ row.item.variation + ' +' }}
		</template>

		<template #cell(average)="row">
			{{ row.item.average | numeralFloat }}
		</template>

		<template #cell(balance)="row">
			{{ row.item.balance | numeralFloat }}
		</template>

		<template #cell(depositAverage)="row">
			{{ row.item.depositAverage | numeralFloat }}
		</template>

		<template #cell(otherAverage)="row">
			{{ row.item.otherAverage | numeralFloat }}
		</template>

		<template #cell(baseContribution)="{ item }">
			{{ item.baseContribution === null ? '-' : item.baseContribution }}
		</template>

		<template #empty>
			<em>在指定时点后，点击“预览结果”以查看</em>
		</template>
	</b-table>
</div>

</template>

<script>
export default {
	data() {
		return {
			batchList: [],
			planList: [],
			form: {
				planId: {
					base: null,
					target: null
				},
				description: ''
			},
			Preview: {
				list: [],
				pending: false,
				page: { per: 10, total: 0, current: 1 },
				filter: { keyword: '' }
			}
		};
	},
	methods: {
		async getBatchList() {
			this.batchList = await this.$rusher.backend.Point.PlanVariation.Batch.query();
		},
		resetPreviewList() {
			this.Preview.list = [];
			this.Preview.pending = false;
		},
		resetForm() {
			this.form.planId.base = null;
			this.form.planId.target = null;
			this.form.description = '';
		},
		async createBatch() {
			await this.$rusher.backend.Point.PlanVariation.Batch.create({
				plan: {
					base: { id: this.form.planId.base },
					target: { id: this.form.planId.target }
				},
				description: this.form.description
			});

			this.resetPreviewList();
			this.resetForm();
			await this.getBatchList();
		},
		async getPreviewList() {
			this.Preview.list = await this.$rusher.backend.Point.PlanVariation.Preview.query({
				planId: {
					base: this.form.planId.base,
					target: this.form.planId.target
				}
			});

			this.Preview.pending = true;
			this.$nextTick(() => this.updatePreviewPageTotal());
		},
		async getPlanList() {
			this.planList = await this.$rusher.backend.Plan.query();
		},
		updatePreviewPageTotal() {
			this.Preview.page.total = this.$refs['preview-table'].filteredItems.length;
		}
	},
	computed: {
		isFormValid() {
			return this.form.planId.base !== null && this.form.planId.target !== null;
		},
		dateAsOptionList() {
			if (this.planList.length === 0) {
				return [{ value: null, text: '无可用的时点' }];
			} else {
				const placeholder = [{ value: null, text: '请选择时点' }];
				const optionList = this.planList.map(plan => {
					return { value: plan.id, text: plan.dateAs };
				});

				return placeholder.concat(optionList);
			}
		},
		fieldListOfBatch() {
			return [
				{ key: 'baseDateAs', label: '基础时点', sortable: true, class: 'col-date' },
				{ key: 'targetDateAs', label: '目标时点', sortable: true, class: 'col-date' },
				{ key: 'customerCount', label: '影响客户数', class: 'col-number', sortable: true },
				{ key: 'totalPoint', label: '总发放积分', class: 'col-number', sortable: true },
				{ key: 'description', label: '描述' },
				{ key: 'createdAt', label: '发放于', class: 'col-datetime' },
				{ key: 'customerList', label: '' },
				{ key: 'blank', label: '', class: 'col-blank' }
			];
		},
		fieldListOfPreview() {
			return [
				{ key: 'name', label: '姓名', class: 'col-short-string'},

				{ key: 'base', label: '当前', sortable: true, class: 'col-short-number' },
				{ key: 'variation', label: '累加', sortable: true, class: 'col-short-number' },
				{ key: 'total', label: '总计', sortable: true, class: 'col-short-number' },

				{ key: 'baseContribution', label: '贡献度', sortable: true, class: 'col-short-number' },
				{ key: 'contribution', label: '贡献度', sortable: true, class: 'col-short-number' },
				{ key: 'average', label: '金融资产日均', sortable: true, class: 'col-number' },
				{ key: 'balance', label: '金融资产余额', sortable: true, class: 'col-number' },
				{ key: 'depositAverage', label: '存款日均', sortable: true, class: 'col-number' },
				{ key: 'otherAverage', label: '非存款日均', sortable: true, class: 'col-number' },
				{ key: 'blank', label: '', class: 'col-auto-blank' }
			];
		},
		itemListOfBatch() {
			return this.batchList.map(batch => {
				return {
					id: batch.id,
					description: batch.description,
					customerCount: batch.customerCount,
					totalPoint: batch.point,
					baseDateAs: batch.plan.base.dateAs,
					targetDateAs: batch.plan.target.dateAs,
					createdAt: new Date(batch.createdAt)
				};
			});
		},
		itemListOfPreview() {
			return this.Preview.list.map(preview => {
				return {
					name: preview.customer.name,
					base: preview.point,
					variation: preview.delta,
					total: preview.point + preview.delta,
					contribution: preview.contribution.value,
					baseContribution: preview.contribution.baseValue,
					average: preview.contribution.average,
					balance: preview.contribution.balance,
					depositAverage: preview.contribution.deposit.average,
					otherAverage: preview.contribution.other.average
				};
			});
		},
	},
	mounted() {
		this.getPlanList();
		this.getBatchList();
	}
};
</script>

<style>

</style>
