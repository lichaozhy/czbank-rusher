<template>

<b-card>
	<b-button-toolbar>

		<b-button
			class="mr-1"
			variant="primary"
			@click="getFileListByPlanId"
		>刷新</b-button>

		<b-form-input
			v-model="keyword"
			placeholder="输入姓名过滤"
			class="mr-auto"
			style="width: 12em"
			autocomplete="off"
		/>

		<b-button
			variant="primary"
			class="mr-auto"
			@click="emitUpoalding"
		>上传到本计划</b-button>

		<b-button
			variant="danger"
			class="mr-0"
		>删除</b-button>
	</b-button-toolbar>

	<b-table
		:items="fileItemList"
		:fields="fileTableFieldList"
		:filter="keyword"
		small
		bordered
		selectable
		select-mode="single"
		class="mt-3 mb-0 plan-file-list"
		show-empty
	>
		<template #cell(createdAt)="row">
			{{ row.item.createdAt | localDatetime }}
		</template>

		<template #cell(size)="row">
			{{ row.item.size | toBytes }}
		</template>

		<template #empty>
			<em>该计划不包含任何报表，您可以</em><b-link
				class="ml-3"
				@click="emitUpoalding"
			>上传报表</b-link>
		</template>
	</b-table>
</b-card>

</template>

<script>
export default {
	data() {
		return {
			keyword: '',
			fileList: [],
		};
	},
	props: {
		planId: {}
	},
	methods: {
		async getFileListByPlanId() {
			this.fileList = await this.$rusher.backend.File.query({
				planId: this.planId
			});
		},
		emitUpoalding() {
			this.$emit('request-upload', { planId: this.planId });
		}
	},
	mounted() {
		this.getFileListByPlanId();
	},
	computed: {
		fileItemList() {
			return this.fileList.map(file => {
				return {
					id: file.id,
					createdAt: file.createdAt,
					description: file.description,
					managerName: file.manager.name,
					managerId: file.manager.id,
					size: file.size,
					customerNumber: file.customerNumber,
					accountNumber: file.accountNumber,
					length: 5000,
				};
			});
		},
		fileTableFieldList() {
			return [
				{
					key: 'managerName',
					label: '客户经理',
					class: 'col-manager-name',
					sortable: true
				},
				{
					key: 'size',
					label: '文件大小',
					class: 'col-size',
					sortable: true
				},
				{
					key: 'accountNumber',
					label: '数据量',
					class: 'col-data-length',
					sortable: true
				},
				{
					key: 'customerNumber',
					label: '客户数',
					class: 'col-costomer-number',
					sortable: true
				},
				{
					key: 'description',
					label: '描述',
					class: 'col-description'
				},
				{
					key: 'createdAt',
					label: '上传于',
					class: 'col-createdat',
					sortable: true
				},
			];
		}
	}
};
</script>

<style lang="scss">
.plan-file-list {
	.col-manager-name {
		width: 6em;
	}

	.col-size {
		width: 6em;
	}

	.col-data-length {
		width: 6em;
	}

	.col-costomer-number {
		width: 6em;
	}

	.col-createdat {
		width: 10em;
	}
}
</style>
