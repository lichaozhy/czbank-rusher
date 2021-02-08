<template>

<div>
	<h1>登记新活动</h1><hr>

	<ul class="list-unstyled">
		<li>结束时间为空时，该活动将在开始时间后永久有效</li>
	</ul>

	<b-form>
		<b-form-row>
			<b-col cols="9">
				<b-form-group
					class="w-50"
					label="名称"
				>
					<b-form-input
						v-model="form.name"
						name="activity-name"
						trim
						autocomplete="off"
					/>
				</b-form-group>

				<b-form-group
					class="w-50"
					label="开始时间"
				>
					<b-input-group>
						<b-form-datepicker
							v-model="form.startedAt.date"
							name="activity-startedAt-date"
						/>
						<b-form-timepicker
							v-model="form.startedAt.time"
							name="activity-startedAt-time"
							:disabled="!form.startedAt.date"
							:hour12="false"
						/>
						<b-button
							@click="setNowAsStartedAt"
							variant="primary"
						>现在开始</b-button>
					</b-input-group>
				</b-form-group>

				<b-form-group
					class="w-50"
					label="结束时间"
				>
					<b-input-group>
						<b-form-datepicker
							v-model="form.endedAt.date"
							name="activity-endedAt-date"
							reset-button
							reset-button-variant="primary"
							label-reset-button="永久有效"
							placeholder="永久有效"
							:date-disabled-fn="endedAtDisabled"
						/>
						<b-form-timepicker
							v-model="form.endedAt.time"
							name="activity-endedAt-time"
							:disabled="!form.endedAt.date"
							placeholder="请选择时间"
							:hour12="false"
						/>
						<b-input-group-addon>
							<b-button
								@click="form.endedAt.date = ''"
								variant="primary"
							>永久有效</b-button>
						</b-input-group-addon>
					</b-input-group>
				</b-form-group>

				<b-form-group
					class="w-50"
					label="描述"
				>
					<b-form-textarea
						v-model="form.description"
						name="activity-description"
						autocomplete="off"
						style="height: 6em"
					/>
				</b-form-group>
			</b-col>
		</b-form-row>

		<b-button
			variant="success"
			@click="createActivity"
		><b-icon-calendar2-date
			class="mr-2"
		/>{{ $t('c.base.create') }}</b-button>
	</b-form>

</div>

</template>

<script>
import activity from './activity';

export default {
	mixins: [activity],
	methods: {
		async createActivity() {
			await this.$rusher.backend.Activity.create({
				name: this.form.name,
				startedAt: this.formStartedAt,
				endedAt: this.formEndedAt,
				description: this.form.description
			});

			await this.$router.push({ name: 'workbench.activity.overview' });
		}
	},
	mounted() {
		this.setNowAsStartedAt();
	}
};
</script>
