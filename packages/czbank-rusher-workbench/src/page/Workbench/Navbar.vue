<template>

<b-navbar
	type="dark"
	variant="dark"
>
	<b-navbar-brand
		:to="{ name: 'home' }"
	>CZB<b
		class="ml-1"
	>Pusher</b></b-navbar-brand>

	<b-navbar-nav>
		<b-nav-item
			:to="{ name: 'workbench.analysis' }"
		>{{ $t('menu.analysis.label') }}</b-nav-item>
		<b-nav-item
			:to="{ name: 'home' }"
		>{{ $t('menu.customer.label') }}</b-nav-item>
		<b-nav-item
			:to="{ name: 'workbench.present' }"
		>{{ $t('menu.present.label') }}</b-nav-item>
		<b-nav-item
			:to="{ name: 'home' }"
		>{{ $t('menu.point.label') }}</b-nav-item>
		<b-nav-item
			:to="{ name: 'home' }"
		>{{ $t('menu.manager.label') }}</b-nav-item>
		<b-nav-item
			:to="{ name: 'workbench.database' }"
		>{{ $t('menu.database.label') }}</b-nav-item>
	</b-navbar-nav>
</b-navbar>

</template>

<script>
export default {

}
</script>

<style>

</style>
