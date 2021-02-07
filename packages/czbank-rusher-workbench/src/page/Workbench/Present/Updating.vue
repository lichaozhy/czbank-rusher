<template>

<b-form>
	<b-form-group
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
		label="描述"
	>
		<b-form-textarea
			v-model="form.description"
			name="present-description"
			autocomplete="off"
			style="height: 6em"
		/>
	</b-form-group>
</b-form>

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
			},
			present: {}
		};
	},
	watch: {
		present(present) {
			this.form.name = present.name;
			this.form.price = present.price;
			this.form.point = present.point;
			this.form.description = present.description;
		}
	},
	props: {
		presentId: {
			type: String,
			required: true
		}
	},
	methods: {
		async getPresent() {
			this.present = await this.IPresent.get();
		},
		async update() {
			return this.IPresent.update({
				name: this.form.name,
				price: this.form.price,
				point: this.form.point,
				description: this.form.description
			});
		}
	},
	computed: {
		IPresent() {
			return this.$rusher.backend.Present(this.presentId);
		}
	},
	async mounted() {
		await this.getPresent();
	}
};
</script>
