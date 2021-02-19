module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'plugin:vue/essential',
		'@vue/standard'
	],
	parserOptions: {
		parser: 'babel-eslint'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		indent: [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		quotes: [
			'error',
			'single'
		],
		semi: [
			'error',
			'always'
		],
		'space-before-function-paren': 'off',
		'no-tabs': 'off',
		'vue/no-v-html': 'warn',
		'vue/this-in-template': 'error'
	}
};
