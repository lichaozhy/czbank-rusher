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
					@click="signout"
				>登出</b-nav-item>
        <b-nav-item
					@click="reload"
				>重启客户端</b-nav-item>
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
		><b-icon-calendar2-date /></h6>活动奖励</b-button>

		<b-button
			variant="primary"
			class="w-100"
			:to="{ name: 'workbench.customer' }"
			v-if="customer === null"
		><h6
			class="my-1"
		><b-icon-people-fill /></h6>找客户</b-button>

		<b-button
			variant="primary"
			class="w-100"
			:to="{ name: 'workbench.customer' }"
			@contextmenu.prevent="resetCurrentCustomerAndJump"
			v-if="customer !== null"
		><h6
			class="my-1"
		><b-icon-person-check-fill
			animation="fade"
		/></h6>{{ customer.name }}</b-button>

		<b-button
			variant="primary"
			class="w-100"
			:to="{ name: 'workbench.manager' }"
		><h6
			class="my-1"
		><b-icon-person-badge /></h6><b>{{ manager.name }}</b></b-button>
	</b-button-group>
</div>

</template>

<script>
export default {
	data() {
		return {
			customer: null
		};
	},
	watch: {
		customerId(value) {
			if (value === null) {
				this.customer = null;
			} else {
				this.getCustomer();
			}
		}
	},
	computed: {
		manager() {
			return this.$store.state.manager;
		},
		customerId() {
			return this.$store.state.customerId;
		}
	},
	methods: {
		async signout() {
			await this.$manager.backend.Principal.delete();
			this.$router.replace({ name: 'home' });
		},
		async getCustomer() {
			this.customer = await this.$manager.backend.Customer(this.customerId).get();
		},
		resetCurrentCustomerAndJump() {
			if (this.$route.name !== 'workbench.customer') {
				this.$store.commit('setCustomer', null);
				this.$router.replace({ name: 'workbench.customer' });
			}
		},
		reload() {
			window.location.reload();
		}
	}
};
</script>

<style lang="scss">
#app-workbench-bottom-nav {
	h6 {
		font-size: 18px;
	}
}
</style>
