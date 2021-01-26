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

			<b-form-group
				label="选择时点"
			>
				<b-form-select
					name="manager-name"
					:options="dateAsOptionList"
					v-model="dateAs"
					:disabled="dateAs === null"
				/>
			</b-form-group>

			<b-card
				no-body
				class="mt-3"
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
					<div><b class="mr-1">{{ manager.name }}'s</b>业绩总览</div>
				</template>

				<b-card-body>
					<p class="text-center">共计客户</p>
					<h1 class="m-0 text-center">{{ manager.customerNumber | numeral }}</h1>
				</b-card-body>

				<b-list-group flush>
					<b-list-group-item>存款余额：</b-list-group-item>
					<b-list-group-item>存款日均：</b-list-group-item>
					<b-list-group-item>非存款余额：</b-list-group-item>
					<b-list-group-item>非存款日均：</b-list-group-item>
				</b-list-group>

				<b-list-group flush class="mt-1">
					<b-list-group-item><b>金融资产余额：</b></b-list-group-item>
					<b-list-group-item><b>金融资产日均：</b></b-list-group-item>
					<b-list-group-item><b>存款占比：</b></b-list-group-item>
					<b-list-group-item><b>贡献度：</b></b-list-group-item>
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
