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
		>{{ $t('m.database.label') }}</b-breadcrumb-item>
	</b-breadcrumb>

	<b-row>
		<b-col
			xxl="2"
			xl="3"
		>
			<b-list-group>
				<b-list-group-item
					:to="{ name: 'workbench.database.account-data-importer' }"
				>{{ $t('m.database.importer.label') }}</b-list-group-item>
				<b-list-group-item
					:to="{ name: 'workbench.database.product' }"
				>{{ $t('m.database.product.label') }}</b-list-group-item>
			</b-list-group>
		</b-col>
		<b-col
			xxl="10"
			xl="9"
		>
			<router-view>Database Function Panel</router-view>
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
