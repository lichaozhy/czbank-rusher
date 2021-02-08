<template>

<div>
	<h1>活动总览</h1><hr>

	<ul class="list-unstyled">
		<li>正在进行的活动，当前时间晚于活动开始时间时，活动不允许活动或删除</li>
		<li>已经开始的活动仍然可以被延期</li>
	</ul>

	<b-button-toolbar>
		<b-button
			class="mr-auto"
			variant="primary"
			:disabled="!selectedActivity || isSelectedActivityStarted"
		>修改</b-button>

		<b-input-group
			prepend="截止于"
			class="mr-3"
		>
			<b-form-datepicker
				reset-button
				reset-button-variant="primary"
				label-reset-button="永久有效"
				button-variant="primary"
				:reset-value="null"
				:placeholder="selectedActivityEndedAtPlaceholder"
				style="width:16em"
				v-model="endedAt"
				:disabled="!selectedActivity"
			></b-form-datepicker>

			<b-input-group-append>
				<b-button
					variant="primary"
					@click="setActivityEndedAt(endedAt)"
					:disabled="!selectedActivity"
				>调整</b-button>
			</b-input-group-append>
		</b-input-group>

		<b-button
			class="mr-auto"
			variant="danger"
			@click="setActivityEndedAt()"
			:disabled="!selectedActivity || isSelectedActivityOver"
		>立即结束</b-button>

		<b-button
			class="mr-0"
			variant="danger"
			@click="deleteActivity"
			:disabled="!selectedActivity || isSelectedActivityStarted"
		>删除</b-button>
	</b-button-toolbar>

	<b-table
		id="present-table"
		class="mt-3"
		ref="activity-table"
		:fields="activityTableFieldList"
		:items="activityItemList"
		small
		hover
		bordered
		selectable
		select-mode="single"
		@row-selected="selectActivity"
	>
		<template #cell(updatedAt)="{ item }">
			{{ item.updatedAt | localDatetime }}
		</template>

		<template #cell(createdAt)="{ item }">
			{{ item.createdAt | localDatetime }}
		</template>

		<template #cell(startedAt)="{ item }">
			{{ item.startedAt | localDatetime }}
		</template>

		<template #cell(endedAt)="{ item }">
			<span v-if="item.endedAt !== null">{{ item.endedAt | localDatetime }}</span>
			<em v-if="item.endedAt === null">永久有效</em>
		</template>
	</b-table>
</div>

</template>

<script>
export default {
	data() {
		return {
			now: new Date(),
			activityList: [],
			selectedActivityId: null,
			endedAt: null
		};
	},
	methods: {
		selectActivity(rows) {
			if (rows.length > 0) {
				this.selectedActivityId = rows[0].id;
				this.endedAt = this.selectedActivity.endedAt;
			} else {
				this.selectedActivityId = null;
				this.endedAt = null;
			}
		},
		async getActivityList() {
			this.$refs['activity-table'].selectRow();
			this.activityList = await this.$rusher.backend.Activity.query();
			this.selectActivity([]);
		},
		async setActivityEndedAt(date = new Date()) {
			date = date ? new Date(date) : null;
			await this.$rusher.backend.Activity(this.selectedActivityId).delayTo(date);
			await this.getActivityList();
		},
		async deleteActivity() {
			await this.$rusher.backend.Activity(this.selectedActivityId).delete();
			await this.getActivityList();
		}
	},
	computed: {
		selectedActivity() {
			return this.activityList.find(activity => activity.id === this.selectedActivityId);
		},
		isSelectedActivityStarted() {
			if (!this.selectedActivity) {
				return false;
			}

			return (this.now - new Date(this.selectedActivity.startedAt)) > 0;
		},
		isSelectedActivityOver() {
			if (!this.selectedActivity) {
				return false;
			}

			if (this.selectedActivity.endedAt === null) {
				return false;
			}

			return (this.now > new Date(this.selectedActivity.endedAt)) > 0;
		},
		selectedActivityEndedAtPlaceholder() {
			if (!this.selectedActivity) {
				return '请选择活动';
			}

			if (this.selectedActivity.endedAt === null) {
				return '永久有效';
			}

			if (!this.endedAt) {
				return '永久有效';
			}

			return '<!未知错误>';
		},
		activityTableFieldList() {
			return [
				{ key: 'name', label: '名称', class: 'col-string' },
				{ key: 'startedAt', label: '开始于', sortable: true, class: 'col-datetime' },
				{ key: 'endedAt', label: '截止于', sortable: true, class: 'col-datetime' },
				{ key: 'participation', label: '参与人数', sortable: true, class: 'col-short-number' },
				{ key: 'description', label: '描述' },
				{ key: 'updatedAt', label: '更新于', sortable: true, class: 'col-datetime' },
				{ key: 'createdAt', label: '创建于', sortable: true, class: 'col-datetime' },
				{ key: 'blank', label: '', class: 'col-blank' }
			];
		},
		activityItemList() {
			return this.activityList.map(activity => {
				return {
					id: activity.id,
					name: activity.name,
					startedAt: new Date(activity.startedAt),
					endedAt: activity.endedAt ? new Date(activity.endedAt) : null,
					participation: activity.participation,
					description: activity.description,
					updatedAt: new Date(activity.updatedAt),
					createdAt: new Date(activity.createdAt),
				};
			});
		}
	},
	async mounted() {
		await this.getActivityList();

		this._observer = setInterval(() => this.now = new Date(), 1000);
	},
	destroyed() {
		clearInterval(this._observer);
	}
};
</script>

<style>

</style>
