<template>

<b-container
	class="mt-3"
>
	<b-row>
		<b-col
			xxl="2"
			xl="3"
		>
			<b-list-group>
				<b-list-group-item
					:to="{ name: 'workbench.customer.overview' }"
				>{{ $t('menu.customer.overview.label') }}</b-list-group-item>
				<b-list-group-item
					:to="{ name: 'workbench.customer.register' }"
				>{{ $t('menu.customer.register.label') }}</b-list-group-item>
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

}
</script>

<style>

</style>
