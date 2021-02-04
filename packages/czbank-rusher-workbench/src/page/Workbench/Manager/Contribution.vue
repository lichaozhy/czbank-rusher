<template>

<div>
	<h1>客户贡献度分布</h1><hr>

	<b-button-toolbar>
		<b-input-group
			prepend="选择时点"
			class="mr-1"
		>
			<b-form-select
				name="manager-name"
				:options="dateAsOptionList"
				v-model="dateAs"
				:disabled="dateAs === null"
				style="width:12em"
			/>
		</b-input-group>

		<b-button
			@click="getAllCustomerList"
			variant="success"
			:disabled="fetching"
		>开始计算</b-button>
	</b-button-toolbar>

	<b-table
		id="manager-contribution"
		class="mt-3"
		:fields="fieldList"
		:items="itemList"
		small
		bordered
		hover
	>
		<template
			v-for="manager in Manager.list"
			v-slot:[`head(${manager.id})`]
		>
			<div
				:key="manager.id"
			>{{ manager.name }}</div>
		</template>
	</b-table>
</div>

</template>

<script>
export default {
	data() {
		return {
			dateAs: null,
			Manager: {
				list: [],
				customerContributionListMap: {}
			},
			itemList: [],
			planList: [],
			fetching: false
		};
	},
	methods: {
		async getManagerList() {
			this.Manager.list = await this.$rusher.backend.Manager.query();
		},
		async getAllCustomerList() {
			this.fetching = true;

			for(const manager of this.Manager.list) {
				this.Manager.customerContributionListMap[manager.id] =
					await this.$rusher.backend.Manager(manager.id)
						.Customer.Contribution.query({ dateAs: this.dateAs });

				this.computeItemList();
			}

			this.fetching = false;
		},
		async getPlanList() {
			this.planList = await this.$rusher.backend.Plan.query();
			this.dateAs = this.planList[0].dateAs;
		},
		computeItemList() {
			const itemList = this.rangeList.map(range => {
				const { from, to } = range;

				return {
					range: `[${from}, ${to})`,
					hit: value => value >= from && value < to
				};
			}).reverse();

			for(const managerId in this.Manager.customerContributionListMap) {
				const contributionList = this.Manager.customerContributionListMap[managerId];

				itemList.forEach(item => item[managerId] = 0);

				contributionList.forEach(contribution => {
					itemList.find(item => item.hit(contribution))[managerId] += 1;
				});
			}

			this.itemList = itemList.reverse();
		}
	},
	computed: {
		dateAsOptionList() {
			if (this.planList.length === 0) {
				return [{ value: null, text: '无可用的时点数据' }];
			} else {
				return this.planList.slice(0).sort((planA, planB) => {
					return planA.dateAs - planB.dateAs;
				}).map(plan => {
					return { value: plan.dateAs, text: plan.dateAs };
				});
			}
		},
		fieldList() {
			const managerField = this.Manager.list.map(manager => {
				return {
					key: manager.id,
					label: `${manager.name}${manager.lastUploadedDateAs}`,
					class: 'col-manager',
					sortable: true
				};
			});

			return [{
				key: 'range', label: '贡献度分段', class: 'col-range'
			}].concat(managerField).concat([{
				key: 'blank', label: ''
			}]);
		},
		rangeList() {
			return [
				{ from: 1000, to: Infinity },
				{ from: 500, to: 1000 },
				{ from: 200, to: 500 },
				{ from: 100, to: 200 },
				{ from: 50, to: 100 },
				{ from: 30, to: 50 },
				{ from: 20, to: 30 },
				{ from: 10, to: 20 },
				{ from: 1, to: 10 },
				{ from: 0, to: 1 },
			];
		},

	},
	async mounted() {
		await this.getManagerList();
		await this.getPlanList();
		this.computeItemList();
	}
};
</script>

<style lang="scss">
#manager-contribution {
	.col-range {
		width: 10em;
	}

	.col-manager {
		width: 7em;
		text-align: right;
	}
}
</style>
