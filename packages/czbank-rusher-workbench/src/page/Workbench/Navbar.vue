<template>

<b-navbar
	type="dark"
	variant="dark"
>
	<b-navbar-brand
		:to="{ name: 'home' }"
	>CZB<b
		class="ml-1"
	>Rusher</b></b-navbar-brand>

	<b-navbar-nav>
		<b-nav-item
			:to="{ name: 'workbench.analysis' }"
		><b-icon-graph-up
			class="mr-1"
		/>{{ $t('menu.analysis.label') }}</b-nav-item>

		<b-nav-item
			:to="{ name: 'workbench.customer' }"
		><b-icon-people-fill
			class="mr-1"
		/>{{ $t('menu.customer.label') }}</b-nav-item>

		<b-nav-item
			:to="{ name: 'workbench.present' }"
		><b-icon-gift-fill
			class="mr-1"
		/>{{ $t('menu.present.label') }}</b-nav-item>

		<b-nav-item
			:to="{ name: 'workbench.point' }"
		><b-icon-star-fill
			class="mr-1"
		/>{{ $t('menu.point.label') }}</b-nav-item>

		<b-nav-item
			:to="{ name: 'workbench.manager' }"
		><b-icon-person-badge
			class="mr-1"
		/>{{ $t('menu.manager.label') }}</b-nav-item>

		<b-nav-item
			:to="{ name: 'workbench.database' }"
		><b-icon-server
			class="mr-1"
		/>{{ $t('menu.database.label') }}</b-nav-item>
	</b-navbar-nav>
</b-navbar>

</template>

<script>
export default {

};
</script>

<style>

</style>
