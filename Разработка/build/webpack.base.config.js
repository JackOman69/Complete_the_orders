const path = require('path');
const сleanWebpackPlugin = require('clean-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const copyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
	src: path.join(__dirname, '../src'),
	dist: path.join(__dirname, '../public'),
	assets: 'static/'
};

module.exports = {

	externals: {
		paths: PATHS
	},

	entry: {
		app: PATHS.src
	},

 	output: {
		filename: `${PATHS.assets}js/[name].js`,
		path: PATHS.dist
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/'
			},

			{
				test: /\.css$/,
				use: [
					'style-loader',
					miniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
          				options: { sourceMap: true }
					},

					{
			        	loader: 'postcss-loader',
			        	options: { sourceMap: true, config: { path: `${PATHS.src}/js/postcss.config.js` } }
					}
				]
			},

			{
				test: /\.scss$/,
				use: [
					'style-loader',
					miniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					},

					{
			        	loader: 'postcss-loader',
			        	options: { sourceMap: true, config: { path: `${PATHS.src}/js/postcss.config.js` } }
					},

					{
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			},

			{
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]'
				} 
			}
		]
	},

	plugins: [
		new miniCssExtractPlugin({
			filename: `${PATHS.assets}css/main.css`
		}),
		new htmlWebpackPlugin({
			template: `${PATHS.src}/index.html`
		}),
		new сleanWebpackPlugin(),
		new copyWebpackPlugin([
	      	{ from: PATHS.src + '/img', to: `img` },
	      	{ from: PATHS.src + '/static' }
		])
	]
}