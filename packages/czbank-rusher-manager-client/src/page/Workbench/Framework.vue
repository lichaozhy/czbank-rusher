<template>

<div
	class="d-flex flex-column"
>
	<b-navbar
		type="dark"
		variant="dark"
		toggleable="lg"
	>
		<b-navbar-brand
			:to="{ name: 'home' }"
		><b class="mr-1">CZBank</b>冲鸭</b-navbar-brand>

    <b-navbar-toggle target="app-menu"></b-navbar-toggle>

		<b-collapse id="app-menu" is-nav>
      <b-navbar-nav>
        <b-nav-item
					:to="{ name: 'home' }"
				>登出</b-nav-item>
      </b-navbar-nav>
		</b-collapse>
	</b-navbar>

	<b-container
		class="flex-grow-1 overflow-auto"
	>
		<router-view>Workbench Framework</router-view>
	</b-container>

	<b-button-group
		id="app-workbench-bottom-nav"
	>
		<b-button
			variant="primary"
			class="w-100"
			:to="{ name: 'workbench.present' }"
		><h6
			class="my-1"
		><b-icon-gift-fill /></h6>兑换礼品</b-button>

		<b-button
			variant="primary"
			class="w-100"
			:to="{ name: 'workbench.activity' }"
		><h6
			class="my-1"
		><b-icon-calendar2-date /></h6>活动登记</b-button>

		<b-button
			variant="primary"
			class="w-100"
			:to="{ name: 'workbench.customer' }"
		><h6
			class="my-1"
		><b-icon-people-fill /></h6>找客户</b-button>

		<b-button
			variant="secondary"
			class="w-100"
			:to="{ name: 'workbench.manager' }"
		><h6
			class="my-1"
		><b-icon-person-badge /></h6>我的</b-button>
	</b-button-group>
</div>

</template>

<script>
export default {

};
</script>

<style lang="scss">
#app-workbench-bottom-nav {
	h6 {
		font-size: 18px;
	}
}
</style>
