<template>

<b-container
	class="mt-3"
>
	<b-breadcrumb>
    <b-breadcrumb-item
			:to="{ name: 'home' }"
		>{{ $t('u.home') }}</b-breadcrumb-item>
    <b-breadcrumb-item
			active
		>{{ $t('m.activity.label') }}</b-breadcrumb-item>
	</b-breadcrumb>
	<b-row>
		<b-col
			xxl="2"
			xl="3"
		>
			<b-list-group>
				<b-list-group-item
					:to="{ name: 'workbench.activity.overview' }"
				>{{ $t('m.activity.overview.label') }}</b-list-group-item>
				<b-list-group-item
					:to="{ name: 'workbench.activity.register' }"
				>{{ $t('m.activity.register.label') }}</b-list-group-item>
			</b-list-group>
		</b-col>
		<b-col
			xxl="10"
			xl="9"
		>
			<router-view>Activity Panel</router-view>
		</b-col>
	</b-row>
</b-container>

</template>

<script>
export default {

};
</script>

<style>

</style>
