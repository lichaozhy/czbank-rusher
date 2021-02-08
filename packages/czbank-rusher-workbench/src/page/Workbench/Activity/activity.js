export default {
	data() {
		return {
			form: {
				name: '',
				startedAt: { date: '', time: '' },
				endedAt: { date: '', time: '' },
				description: ''
			}
		};
	},
	watch: {
		'form.endedAt.date'(value) {
			if (value === '') {
				this.form.endedAt.time = '';
			} else {
				this.form.endedAt.time = this.$rusher.Utils.localTime(new Date());
			}
		},
		'form.startedAt.date'(value) {
			const endedAtDate = this.form.endedAt.date;

			if (endedAtDate !== '' && value > endedAtDate) {
				this.form.endedAt.date = value;
			}
		}
	},
	computed: {
		formStartedAt() {
			return new Date(`${this.form.startedAt.date} ${this.form.startedAt.time}`);
		},
		formEndedAt() {
			if (this.form.endedAt.date === '') {
				return null;
			}

			return new Date(`${this.form.endedAt.date} ${this.form.endedAt.time}`);
		}
	},
	methods: {
		setNowAsStartedAt() {
			const now = new Date();

			this.form.startedAt = {
				date: this.$rusher.Utils.localDate(now),
				time: this.$rusher.Utils.localTime(now)
			};
		},
		endedAtDisabled(ymd) {
			return ymd < this.form.startedAt.date;
		},
		dateToDatetime(date) {
			return {
				date: this.$rusher.Utils.localDate(date),
				time: this.$rusher.Utils.localTime(date)
			};
		}
	}
};
