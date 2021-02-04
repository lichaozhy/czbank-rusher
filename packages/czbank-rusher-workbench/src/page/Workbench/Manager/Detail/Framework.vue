<template>

<b-container
	class="mt-3"
>
	<b-breadcrumb>
    <b-breadcrumb-item
			:to="{ name: 'home' }"
		>{{ $t('u.home') }}</b-breadcrumb-item>
    <b-breadcrumb-item
			:to="{ name: 'workbench.manager' }"
		>{{ $t('c.manager.className') }}</b-breadcrumb-item>
    <b-breadcrumb-item
			active
		>{{ manager.name }}</b-breadcrumb-item>
	</b-breadcrumb>

	<b-row>
		<b-col
			xxl="2"
			xl="3"
		>
			<b-card
				class="mb-3"
				no-body
			>
				<template #header>
					<div><b class="mr-1">{{ manager.name }}'s</b>统计</div>
				</template>

				<b-list-group
					flush
				>
					<b-list-group-item
						:to="{ name: 'workbench.manager.detail.customer' }"
					>客户总览</b-list-group-item>
					<b-list-group-item
						:to="{ name: 'workbench.manager.detail.customer-change' }"
					>客户指标变动</b-list-group-item>
				</b-list-group>
			</b-card>

			<b-card
				no-body
				class="mt-3"
			>
				<template #header>
					<b-input-group
						prepend="选择时点"
					>
						<b-form-select
							name="manager-name"
							:options="dateAsOptionList"
							v-model="dateAs"
							:disabled="performanceListSortedByDateAs.length === 0"
						/>
					</b-input-group>
				</template>

				<b-card-body>
					<p class="text-center">共计客户</p>
					<h1
						class="m-0 text-center"
					>{{ contribution ? contribution.customerNumber : 0 | numeral }}</h1>
				</b-card-body>

				<b-list-group flush class="mt-1">
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>金融资产余额：</b><span>{{ contribution.balance | numeral }}</span></b-list-group-item>
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>金融资产日均：</b><span>{{ contribution.average | numeral }}</span></b-list-group-item>
				</b-list-group>

				<b-list-group flush class="mt-1">
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>存款余额：</b><span>{{ contribution.deposit.balance | numeral }}</span></b-list-group-item>
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>存款日均：</b><span>{{ contribution.deposit.average | numeral }}</span></b-list-group-item>
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>非存款余额：</b><span>{{ contribution.other.balance | numeral }}</span></b-list-group-item>
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>非存款日均：</b><span>{{ contribution.other.average | numeral }}</span></b-list-group-item>
				</b-list-group>

				<b-list-group flush class="mt-1">
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>存款占比：</b><span>{{ (contribution.rate * 100).toFixed(2) + '%' }}</span></b-list-group-item>
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>贡献度：</b><span>{{ contribution.value | numeral }}</span></b-list-group-item>
				</b-list-group>
			</b-card>
		</b-col>
		<b-col
			xxl="10"
			xl="9"
		>
			<router-view>Manager Panel</router-view>
		</b-col>
	</b-row>
</b-container>

</template>

<script>
export default {
	data() {
		return {
			manager: { name: '', code: '', id: '' },
			performanceList: [],
			dateAs: null
		};
	},
	computed: {
		managerId() {
			return this.$route.params.managerId;
		},
		IManager() {
			return this.$rusher.backend.Manager(this.managerId);
		},
		performanceListSortedByDateAs() {
			return this.performanceList.slice(0).sort((a, b) => a.dateAs - b.dateAs);
		},
		performanceMap() {
			const map = {};

			this.performanceList.forEach(performance => map[performance.dateAs] = performance);

			return map;
		},
		dateAsOptionList() {
			if (this.performanceListSortedByDateAs.length === 0) {
				return [{ value: null, text: '无可用的时点数据' }];
			} else {
				return this.performanceListSortedByDateAs.map(performance => {
					return { value: performance.dateAs, text: performance.dateAs };
				});
			}
		},
		contribution() {
			const contribution = {
				deposit: { balance: null, average: null },
				other: { balance: null, average: null },
				balance: null,
				average: null,
				customerNumber: null,
				rate: null,
				value: null
			};

			if (this.dateAs !== null) {
				const current = this.performanceMap[this.dateAs];
				const { contribution: c } = current;

				contribution.deposit.balance = c.deposit.balance;
				contribution.deposit.average = c.deposit.average;
				contribution.other.balance = c.other.balance;
				contribution.other.average = c.other.average;
				contribution.balance = c.balance;
				contribution.average = c.average;
				contribution.rate = c.rate;
				contribution.value = c.value;
				contribution.customerNumber = current.customerNumber;
			}

			return contribution;
		}
	},
	methods: {
		async getManager() {
			this.manager = await this.IManager.get();
		},
		async getManagerPerformanceList() {
			this.performanceList = await this.IManager.Performance.query();
		}
	},
	async mounted() {
		await this.getManager();
		await this.getManagerPerformanceList();

		if (this.dateAsOptionList.length > 0) {
			this.dateAs = this.dateAsOptionList[0].value;
		}
	}
};
</script>
