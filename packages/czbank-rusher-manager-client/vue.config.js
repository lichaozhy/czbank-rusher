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
			port: 8000,
			proxy: {
				'/api': {
					target: 'http://127.0.0.1:3001'
				}
			}
		}
	}
};
