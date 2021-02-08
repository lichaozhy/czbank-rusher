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
				style="width:14em"
				v-model="endedAt.date"
				:disabled="!selectedActivity"
				:date-disabled-fn="endedAtDisabled"
			></b-form-datepicker>
			<b-form-timepicker
				v-model="endedAt.time"
				name="activity-endedAt-time"
				:disabled="!selectedActivity || endedAt.date === ''"
				placeholder="选择时间"
				:hour12="false"
				style="width:8em"
			/>

			<b-input-group-append>
				<b-button
					variant="primary"
					@click="setActivityEndedAt(endedAtDatetime)"
					:disabled="!selectedActivity"
				>调整</b-button>
			</b-input-group-append>
		</b-input-group>

		<b-button
			class="mr-auto"
			variant="danger"
			@click="setActivityEndedAt()"
			:disabled="!selectedActivity || isSelectedActivityOver || !isSelectedActivityStarted"
		>立即结束</b-button>

		<b-button
			class="mr-0"
			variant="danger"
			@click="deleteActivity"
			:disabled="!selectedActivity || isSelectedActivityStarted"
		>删除</b-button>
	</b-button-toolbar>

	<b-table
		id="activity-table"
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
		<template #cell(stage)="{ item }">
			<b-progress
				v-if="item.stage === 'waiting'"
				max="1"
				value="1"
				variant="primary"
			></b-progress>
			<b-progress
				v-if="item.stage === 'running'"
				max="1"
				value="1"
				animated
				variant="success"
			></b-progress>
			<b-progress
				v-if="item.stage === 'finished'"
				max="1"
				value="1"
				variant="secondary"
			></b-progress>
			<b-progress
				v-if="item.stage === 'error'"
				max="1"
				value="1"
				animated
				variant="danger"
			></b-progress>
		</template>

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
function getStage(now, startedAt, endedAt) {
	now = new Date(now);
	startedAt = new Date(startedAt);
	endedAt = endedAt === null ? endedAt : new Date(endedAt);

	if (now < startedAt) {
		return 'waiting';
	}

	if (endedAt === null || now < endedAt) {
		return 'running';
	}

	if (now > endedAt) {
		return 'finished';
	}

	return 'error';
}

function NullEndedAt() {
	return { date: '', time: '' };
}

export default {
	data() {
		return {
			now: new Date(),
			activityList: [],
			selectedActivityId: null,
			endedAt: NullEndedAt()
		};
	},
	methods: {
		endedAtDisabled(ymd) {
			if (!this.selectedActivity) {
				return true;
			}

			const startedAtYMD = this.$rusher.Utils.localDate(new Date(this.selectedActivity.startedAt));

			return ymd < startedAtYMD;
		},
		selectActivity(rows) {
			if (rows.length > 0) {
				const endedAt = rows[0].endedAt;

				this.selectedActivityId = rows[0].id;

				if (endedAt !== null) {
					this.endedAt = {
						date: this.$rusher.Utils.localDate(endedAt),
						time: this.$rusher.Utils.localTime(endedAt)
					};
				} else {
					this.endedAt = NullEndedAt();
				}
			} else {
				this.selectedActivityId = null;
				this.endedAt = NullEndedAt();
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
		endedAtDatetime() {
			if (this.endedAt.date === '') {
				return null;
			}

			return new Date(`${this.endedAt.date} ${this.endedAt.time}`);
		},
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
				{ key: 'stage', label: '阶段', class: 'col-stage', sortable: true },
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
					stage: getStage(this.now, activity.startedAt, activity.endedAt),
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

<style lang="scss">
#activity-table {
	.col-stage {
		width: 4em;
		text-align: center;
	}
}
</style>
