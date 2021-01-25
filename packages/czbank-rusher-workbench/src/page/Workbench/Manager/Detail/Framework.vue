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

	<b-row>
		<b-col
			xxl="2"
			xl="3"
		>

			<b-form-group
				label="当前时点"
			>
				<b-form-select
					name="manager-name"
				/>
			</b-form-group>

			<b-card
				no-body
			>
				<template #header>
					<div><b class="mr-1">{{ manager.name }}'s</b>营销总览</div>
				</template>

				<b-list-group flush>
					<b-list-group-item>总资产：</b-list-group-item>
					<b-list-group-item>总日均：</b-list-group-item>
				</b-list-group>

				<b-card-body>
					<p class="text-center">共计客户</p>
					<h1 class="m-0 text-center">{{ manager.customerNumber | numeral }}</h1>
				</b-card-body>
			</b-card>

			<b-card
				no-body
				class="mt-3"
			>
				<template #header>
					<div><b class="mr-1">{{ manager.name }}'s</b>统计</div>
				</template>

				<b-list-group
					flush
				>
					<b-list-group-item
						:to="{ name: 'workbench.manager.detail.customer' }"
					>客户总览</b-list-group-item>
				</b-list-group>
			</b-card>
		</b-col>
		<b-col
			xxl="10"
			xl="9"
		>
			<router-view>Manager Panel</router-view>
		</b-col>
	</b-row>
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
		};
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
};
</script>

<style>

</style>
