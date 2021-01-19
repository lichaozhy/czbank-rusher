<template>

<div>
	<h1>{{ $t('c.base.create') }}{{ $t('c.manager.className') }}</h1><hr>
	<h2>基本信息</h2>
	<b-form>
		<b-form-row>
			<b-col cols="9">
				<b-form-group
					class="w-50"
					:label="$t('c.manager.name')"
					:description="$t('d.manager.name')"
					:state="!$v.form.name.$invalid"
					valid-feedback="合法的姓名"
					:invalid-feedback="invalidNameFeedback"
				>
					<b-form-input
						v-model="form.name"
						name="manager-name"
						trim
						autocomplete="off"
						:state="!$v.form.name.$invalid"
					/>
				</b-form-group>

				<b-form-group
					class="w-50"
					:label="$t('c.manager.code')"
					:description="$t('d.manager.code')"
					:state="!$v.form.code.$invalid"
					valid-feedback="工号输入正确"
					:invalid-feedback="invalidCodeFeedback"
				>
					<b-form-input
						v-model="form.code"
						name="manager-code"
						trim
						autocomplete="off"
						:state="!$v.form.code.$invalid"
					/>
				</b-form-group>
			</b-col>
		</b-form-row>

		<b-button
			variant="success"
			@click="createManager"
			:disabled="$v.form.$invalid"
		><b-icon-person-plus-fill
			class="mr-2"
		/>{{ $t('c.base.create') }}</b-button>
	</b-form>

</div>

</template>

<script>
import {
	required,
	minLength,
	maxLength,
} from 'vuelidate/lib/validators';

export default {
	data() {
		return {
			form: {
				name: '',
				code: ''
			}
		};
	},
	computed: {
		invalidNameFeedback() {
			const { required, minLength, maxLength } = this.$v.form.name;

			if (!required) {
				return '必须填写一个正确的姓名';
			}

			if (!minLength) {
				return '姓名长度不能少于2';
			}

			if (!maxLength) {
				return '姓名长度不能大于10';
			}

			return '';
		},
		invalidCodeFeedback() {
			const { required, minLength, maxLength } = this.$v.form.name;

			if (!required) {
				return '必须填写一个正确的工号';
			}

			if (!minLength || !maxLength) {
				return '工号必须长度必须是10';
			}

			return '';
		}
	},
	validations: {
		form: {
			name: {
				required,
				minLength: minLength(2),
				maxLength: maxLength(10)
			},
			code: {
				required,
				minLength: minLength(5),
				maxLength: maxLength(5)
			}
		}
	},
	methods: {
		async createManager() {
			await this.$rusher.backend.Manager.create({
				name: this.form.name,
				code: this.form.code
			});

			await this.$router.push({ name: 'workbench.manager.overview' });
		}
	}
};
</script>

<style>

</style>
