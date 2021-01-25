<template>

<b-form>
	<b-form-row>
		<b-col cols="6">
			<b-form-group
				label="客户经理"
			>
				<b-form-select
					:options="managerSelectOptionList"
					v-model="form.managerId"
				></b-form-select>
			</b-form-group>
		</b-col>
		<b-col cols="6">
			<b-form-group
				label="确认时点"
			>
				<b-form-input
					readonly
					disabled
					v-model="plan.dateAs"
				/>
			</b-form-group>
		</b-col>
	</b-form-row>

	<b-form-group
		label="报表文件(*.xls)"
	>
		<b-form-file
			size="lg"
			v-model="form.file"
			accept=".xls, xlsx"
			browse-text="选择文件"
			placeholder="请选择文件 或 将文件拖动至此"
			required
		/>
	</b-form-group>

	<b-form-group
		:label="$t('c.base.description')"
		:description="$t('d.file.description')"
		valid-feedback=""
	>
		<b-form-textarea
			v-model="form.description"
			trim
			name="product-description"
			autocomplete="off"
			style="height: 8em"
		/>
	</b-form-group>
</b-form>

</template>

<script>
export default {
	data() {
		return {
			managerList: [],
			plan: {},
			form: {
				managerId: null,
				file: null,
				description: ''
			}
		};
	},
	props: {
		planId: {}
	},
	methods: {
		async getManagerList() {
			this.managerList = await this.$rusher.backend.Manager.query();
		},
		async getPlan() {
			this.plan = await this.$rusher.backend.AccountDataPlan(this.planId).get();
		},
		async upload() {
			await this.$rusher.backend.File.create({
				planId: this.planId,
				managerId: this.form.managerId,
				raw: this.form.file
			});
		}
	},
	computed: {
		managerSelectOptionList() {
			const managerOptionList = this.managerList.map(manager => {
				return { value: manager.id, text: manager.name };
			});

			return [{ value: null, text: '请选择' }].concat(managerOptionList);
		}
	},
	mounted() {
		this.getManagerList();
		this.getPlan();
	}
};
</script>

<style>

</style>
