const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')

const devWebpackConfig = merge(baseWebpackConfig, {
 	mode: 'development',
 	devServer: {
 		port: 8081,
 		contentbase: baseWebpackConfig.externals.path.dist,
 		overlay: {
 			warnings: true,
 			errors: true
 		}
 	},
 	devtool: 'cheap-module-eval-source-map',
  	plugins: [
	    new webpack.SourceMapDevToolPlugin({
	    	filename: "[file].map"
	    }),
  	]
});

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
})