<template>

<div>
	<h1>登记礼品</h1><hr>

	<b-form>
		<b-form-row>
			<b-col cols="9">
				<b-form-group
					class="w-50"
					label="名称"
				>
					<b-form-input
						v-model="form.name"
						name="present-name"
						trim
						autocomplete="off"
					/>
				</b-form-group>

				<b-form-group
					class="w-50"
					label="采购成本"
				>
					<b-form-input
						v-model.number="form.price"
						name="present-price"
						trim
						number
						autocomplete="off"
					/>
				</b-form-group>

				<b-form-group
					class="w-50"
					label="积分价格"
				>
					<b-form-input
						v-model.number="form.point"
						name="present-point"
						trim
						number
						autocomplete="off"
					/>
				</b-form-group>

				<b-form-group
					class="w-50"
					label="描述"
				>
					<b-form-textarea
						v-model="form.description"
						name="present-description"
						autocomplete="off"
						style="height: 6em"
					/>
				</b-form-group>
			</b-col>
		</b-form-row>

		<b-button
			variant="success"
			@click="createPresent"
		><b-icon-gift-fill
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
				price: '',
				point: '',
				description: ''
			}
		};
	},
	methods: {
		async createPresent() {
			await this.$rusher.backend.Present.create({
				name: this.form.name,
				price: this.form.price,
				point: this.form.point,
				description: this.form.description
			});

			await this.$router.push({ name: 'workbench.present.overview' });
		}
	}
};
</script>

<style>

</style>
