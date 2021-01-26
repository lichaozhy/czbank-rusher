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

			<!-- <b-form-group
				label="选择时点"
			>
				<b-form-select
					name="manager-name"
					:options="dateAsOptionList"
					v-model="dateAs"
					:disabled="dateAs === null"
				/>
			</b-form-group> -->

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
							:disabled="dateAs === null"
						/>
					</b-input-group>
				</template>

				<b-card-body>
					<p class="text-center">共计客户</p>
					<h1
						class="m-0 text-center"
					>{{ currentFile ? currentFile.customerNumber : 0 | numeral }}</h1>
				</b-card-body>

				<b-list-group flush class="mt-1">
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>金融资产余额：</b><span>{{ matrix.balance | numeral }}</span></b-list-group-item>
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>金融资产日均：</b><span>{{ matrix.average | numeral }}</span></b-list-group-item>
				</b-list-group>

				<b-list-group flush class="mt-1">
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>存款余额：</b><span>{{ matrix.deposit.balance | numeral }}</span></b-list-group-item>
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>存款日均：</b><span>{{ matrix.deposit.average | numeral }}</span></b-list-group-item>
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>非存款余额：</b><span>{{ matrix.nonDeposit.balance | numeral }}</span></b-list-group-item>
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>非存款日均：</b><span>{{ matrix.nonDeposit.average | numeral }}</span></b-list-group-item>
				</b-list-group>

				<b-list-group flush class="mt-1">
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>存款占比：</b><span>{{ (matrix.depositRate * 100).toFixed(2) + '%' }}</span></b-list-group-item>
					<b-list-group-item
						class="d-flex justify-content-between align-items-center"
					><b>贡献度：</b><span>{{ matrix.contribution | numeral }}</span></b-list-group-item>
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
import Matrix from './matrix';

export default {
	data() {
		return {
			manager: {
				name: '',
				code: '',
				id: '',
				customerNumber: 0
			},
			fileList: [],
			dateAs: null
		};
	},
	computed: {
		managerId() {
			return this.$route.params.managerId;
		},
		Manager() {
			return this.$rusher.backend.Manager(this.managerId);
		},
		dateAsOptionList() {
			if (this.fileList.length === 0) {
				return [{ value: null, text: '无可用的时点数据' }];
			} else {
				return this.fileList.slice(0).sort((fileA, fileB) => {
					return fileA.plan.dateAs - fileB.plan.dateAs;
				}).map(file => {
					return { value: file.plan.dateAs, text: file.plan.dateAs };
				});
			}
		},
		currentFile() {
			return this.fileList.find(file => file.plan.dateAs === this.dateAs);
		},
		matrix() {
			return Matrix(this.currentFile ? this.currentFile.abstract : null);
		}
	},
	methods: {
		async getManager() {
			this.manager = await this.Manager.get();
		},
		async getManagerFile() {
			this.fileList = await this.Manager.File.query();

			if (this.fileList.length > 0) {
				this.dateAs = this.fileList.slice(0).sort((fileA, fileB) => {
					return fileA.plan.dateAs - fileB.plan.dateAs;
				})[0].plan.dateAs;
			}
		}
	},
	mounted() {
		this.getManager();
		this.getManagerFile();
	}
};
</script>

<style>

</style>
