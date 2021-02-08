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
					<b-form-datepicker
						v-model="form.startedAt"
						name="activity-startedAt"
					/>
				</b-form-group>

				<b-form-group
					class="w-50"
					label="结束时间"
				>
					<b-form-datepicker
						v-model="form.endedAt"
						name="activity-endedAt"
						reset-button
						reset-button-variant="primary"
						label-reset-button="永久有效"
						placeholder="永久有效"
					/>
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
export default {
	data() {
		return {
			form: {
				name: '',
				startedAt: new Date(),
				endedAt: '',
				description: ''
			}
		};
	},
	methods: {
		async createActivity() {
			await this.$rusher.backend.Activity.create({
				name: this.form.name,
				startedAt: this.form.startedAt,
				endedAt: this.form.endedAt,
				description: this.form.description
			});

			await this.$router.push({ name: 'workbench.activity.overview' });
		}
	}
};
</script>

<style>

</style>
