<template>

<b-container
	class="mt-3"
>
	<b-breadcrumb>
    <b-breadcrumb-item
			:to="{ name: 'home' }"
		>{{ $t('u.home') }}</b-breadcrumb-item>
    <b-breadcrumb-item
			:to="{ name: 'workbench.manager' }"
		>{{ $t('c.manager.className') }}</b-breadcrumb-item>
    <b-breadcrumb-item
			active
		>{{ manager.name }}</b-breadcrumb-item>
	</b-breadcrumb>
</b-container>

</template>

<script>
export default {
	data() {
		return {
			manager: {
				name: '',
				code: '',
				id: '',
				customerNumber: 0
			}
		}
	},
	computed: {
		managerId() {
			return this.$route.params.managerId;
		}
	},
	methods: {
		async getManager() {
			this.manager = await this.$rusher.backend.Manager(this.managerId).get();
		}
	},
	mounted() {
		this.getManager();
	}
}
</script>

<style>

</style>
