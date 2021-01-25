<template>

<div>
	<h1>导入账户数据</h1><hr>
	<p>{{ $t('d.database.importer') }}</p>

	<h2>计划总览</h2>
	<b-button-toolbar>
		<b-button
			variant="danger"
			class="mr-auto"
			:disabled="selectedPlanId === null"
			@click="deletePlan"
		>废除计划</b-button>

		<b-button
			variant="primary"
			class="mr-auto"
			:disabled="selectedPlanId === null"
			@click="requestUpdatingPlan"
		>修改计划</b-button>

		<b-button
			variant="primary"
			class="mr-auto"
			:disabled="selectedPlanId === null"
			@click="requestUploadingFile"
		>上传到计划</b-button>

		<b-button
			class="mr-1"
			variant="primary"
			@click="getPlanList"
		>刷新</b-button>

		<b-button
			class="mr-0"
			variant="success"
			@click="requestCreatingPlan"
		>新建计划</b-button>

	</b-button-toolbar>

	<b-table
		id="plan-list"
		class="mt-3"
		ref="plan-table"
		:items="planItemList"
		:fields="planFieldList"
		small
		selectable
		select-mode="single"
		@row-selected="selectPlan"
		:filter="keyword"
	>
		<template #cell(createdAt)="row">
			{{ row.item.createdAt | localDatetime }}
		</template>

		<template #cell(detail)="row">
			<b-button
				size="sm"
				@click="row.toggleDetails"
				class="text-nowrap"
			>{{ row.detailsShowing ? '收缩' : '展开'}}</b-button>
		</template>

		<template #row-details="row">
			<FileListPanel
				@request-upload="requestUploadByFilePanel(row.item.id)"
				:plan-id="row.item.id"
			/>
		</template>
	</b-table>

	<b-modal
		centered
		title="创建导入计划"
		ref="creating"
		:ok-title="$t('u.ok')"
		:cancel-title="$t('u.cancel')"
		@ok="createPlan($event)"
	>
		<PlanCreating
			ref="plan-creating-form"
		/>
	</b-modal>

	<b-modal
		centered
		title="修改导入计划"
		ref="updating"
		:ok-title="$t('u.ok')"
		:cancel-title="$t('u.cancel')"
		@ok="updatePlan($event)"
	>
		<PlanUpdating
			:plan-id="selectedPlanId"
			ref="plan-updating-form"
		/>
	</b-modal>

	<b-modal
		centered
		:title="`上传XLS到：${selectedPlan.name}`"
		ref="uploader"
		:ok-title="$t('u.ok')"
		:cancel-title="$t('u.cancel')"
		@ok="uploadFile($event)"
	>
		<FileUploader
			ref="uploader-form"
			:plan-id="selectedPlanId"
		/>
	</b-modal>
</div>

</template>

<script>
import PlanCreating from './Creating';
import PlanUpdating from './Updating';
import FileUploader from './Uploader';
import FileListPanel from './FileTable';

export default {
	data() {
		return {
			keyword: '',
			selectedPlanId: null,
			planList: []
		};
	},
	methods: {
		selectPlan(rows) {
			this.selectedPlanId = rows.length > 0 ? rows[0].id : null;
		},
		async getPlanList() {
			this.planList = await this.$rusher.backend.AccountDataPlan.query();
		},
		requestCreatingPlan() {
			this.$refs.creating.show();
		},
		async createPlan(event) {
			try {
				await this.$refs['plan-creating-form'].create();
				await this.getPlanList();
			} catch (err) {
				console.log(err);
				event.preventDefault();
			}
		},
		requestUpdatingPlan() {
			this.$refs.updating.show();
		},
		async updatePlan(event) {
			try {
				await this.$refs['plan-updating-form'].update();
				await this.getPlanList();
			} catch (err) {
				console.log(err);
				event.preventDefault();
			}
		},
		async deletePlan() {
			await this.$rusher.backend.AccountDataPlan(this.selectedPlanId).delete();
			this.getPlanList();
		},
		requestUploadingFile() {
			this.$refs.uploader.show();
		},
		async uploadFile(event) {
			try {
				await this.$refs['uploader-form'].upload();
				await this.getPlanList();
			} catch (err) {
				console.log(err);
				event.preventDefault();
			}
		},
		requestUploadByFilePanel(planId) {
			const rowIndex = this.$refs['plan-table'].sortedItems
				.findIndex(plan => plan.id === planId);

			this.$refs['plan-table'].selectRow(rowIndex);
			this.requestUploadingFile();
		}
	},
	mounted() {
		this.getPlanList();
	},
	components: {
		PlanCreating,
		PlanUpdating,
		FileUploader,
		FileListPanel
	},
	computed: {
		selectedPlan() {
			return this.planList.find(plan => plan.id === this.selectedPlanId) || {};
		},
		planItemList() {
			return this.planList.map(plan => {
				return {
					id: plan.id,
					name: plan.name,
					description: plan.description,
					dateAs: plan.dateAs,
					fileNumber: plan.fileNumber,
					createdAt: new Date(plan.createdAt)
				};
			});
		},
		planFieldList() {
			return [
				{
					key: 'name',
					label: this.$t('c.account.data.plan.name'),
					class: 'col-name',
				},
				{
					key: 'dateAs',
					label: this.$t('c.account.data.plan.dateAs'),
					class: 'col-dateas',
					sortable: true
				},
				{
					key: 'fileNumber',
					label: this.$t('c.account.data.plan.fileNumber'),
					class: 'col-file-number',
					sortable: true
				},
				{
					key: 'description',
					label: this.$t('c.account.data.plan.description'),
					class: 'col-description',
				},
				{
					key: 'createdAt',
					label: this.$t('c.base.createdAt'),
					class: 'col-createdat',
					sortable: true
				},
				{
					key: 'detail',
					label: '',
					class: 'col-detail',
				},
				{
					key: 'blank',
					label: '',
					class: 'col-blank',
				}
			];
		},
	}
};
</script>

<style lang="scss">
#plan-list {

	.col-name {
		width: 12em;
	}

	.col-dateas {
		width: 7em;
	}

	.col-file-number {
		width: 5em;
	}

	.col-createdat {
		width: 10em;
	}

	.col-detail {
		width: 1px;
	}
}
</style>
