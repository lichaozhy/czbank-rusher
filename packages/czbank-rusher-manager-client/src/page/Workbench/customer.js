export default {
	data() {
		return {
			currentCustomer: null
		};
	},
	methods: {
		async getCustomerById(id) {
			this.currentCustomer = await this.$manager.backend.Customer(id).get();
		}
	},
	watch: {
		currentCustomerId(value) {
			if (value === null) {
				this.currentCustomer = null;
			} else {
				this.getCustomerById(value);
			}
		}
	},
	computed: {
		currentCustomerId() {
			return this.$store.state.customerId;
		},
		currentCustomerName() {
			return this.currentCustomer === null ? '' : this.currentCustomer.name;
		},
		hasCurrentCustomer() {
			return this.currentCustomerId !== null;
		}
	},
	mounted() {
		if (this.currentCustomerId !== null) {
			this.getCustomerById(this.currentCustomerId);
		}
	}
};
