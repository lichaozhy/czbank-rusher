module.exports = {
	configureWebpack: {
		module: {
			rules: [
				{
					test: /\.ya?ml$/,
					type: 'json',
					use: 'yaml-loader'
				}
			]
		},
		devServer: {
			proxy: {
				'/api': {
					target: 'http://127.0.0.1:3000'
				}
			}
		}
	}
}
