import Vue from 'vue';
import VueI18n from 'vue-i18n';

import MessageZhCn from './lang/zh_CN';

Vue.use(VueI18n);

export default new VueI18n({
	locale: 'zh_CN',
	messages: {
		zh_CN: MessageZhCn
	}
});
