<template>

<div>
	<h1>最新客户贡献度分布</h1><hr>

	<b-table
		id="manager-contribution"
		:fields="fieldList"
		:items="itemList"
		small
		bordered
	>

		<template
			v-for="manager in Manager.list"
			v-slot:[`head(${manager.id})`]
		>
			<div
				:key="manager.id"
			>{{ manager.name }}<div>{{ manager.lastUploadedDateAs }}</div></div>
		</template>
	</b-table>
</div>

</template>

<script>
const DEPOSIT_PRODUCT_CODE = 'DEPOSIT';

export default {
	data() {
		return {
			dateAs: null,
			Manager: {
				list: [],
				customerListMap: {}
			},
			itemList: []
		};
	},
	methods: {
		async getManagerList() {
			this.Manager.list = await this.$rusher.backend.Manager.query();
		},
		async getAllCustomerList() {
			for(const manager of this.Manager.list) {
				this.Manager.customerListMap[manager.id] =
					await this.$rusher.backend.Manager(manager.id)
						.Customer.query({ dateAs: manager.lastUploadedDateAs });
			}

			this.computeItemList();
		},
		getContributeFromData(data) {
			const clone = Object.assign({}, data);
			const average = { deposit: 0, nonDeposit: 0 };

			if (clone[DEPOSIT_PRODUCT_CODE]) {
				average.deposit = clone[DEPOSIT_PRODUCT_CODE].averageDeposit;
			}

			delete clone[DEPOSIT_PRODUCT_CODE];

			for(const productCode in clone) {
				average.nonDeposit += clone[productCode].averageDeposit;
			}

			return Math.round((average.deposit * 2 + average.nonDeposit) / 10000);
		},
		computeItemList() {
			const contributionOfManagerCustomerListMap = {};

			for(const managerId in this.Manager.customerListMap) {
				const contributionList = this.Manager.customerListMap[managerId]
					.map(customer => this.getContributeFromData(customer.data));

				contributionOfManagerCustomerListMap[managerId] = contributionList;
			}

			const itemList = this.rangeList.map(range => {
				const { from, to } = range;

				return {
					range: `[${from}, ${to})`,
					hit: (contribution) => contribution >= from && contribution < to
				};
			}).reverse();

			for(const managerId in contributionOfManagerCustomerListMap) {
				const contributionList = contributionOfManagerCustomerListMap[managerId];

				itemList.forEach(item => item[managerId] = 0);

				contributionList.forEach(contribution => {
					itemList.find(item => item.hit(contribution))[managerId] += 1;
				});
			}

			this.itemList = itemList.reverse();
		}
	},
	computed: {
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
				key: 'range',
				label: '贡献度分段',
				class: 'col-range'
			}].concat(managerField).concat([{
				key: 'blank',
				label: '',
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
		await this.getAllCustomerList();
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
