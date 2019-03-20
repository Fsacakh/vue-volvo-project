var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
const vuxLoader = require('vux-loader')
var projectRoot = path.resolve(__dirname, '../')

const webpackConfig = {
    entry: {
        app: ['./src/main.js']
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'components': path.resolve(__dirname, '../src/components'),
            'jquery': path.resolve(__dirname, '../node_modules/jquery/dist/jquery.min'),
            'bootstrap': path.resolve(__dirname, '../node_modules/bootstrap')
        }
    },
    // 增加一个plugins
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        // preLoaders: [
        //   {
        //     test: /\.vue$/,
        //     loader: 'eslint',
        //     include: projectRoot,
        //     exclude: /node_modules|src\/components\/vue-strap/
        //   },
        //   {
        //     test: /\.js$/,
        //     loader: 'eslint',
        //     include: projectRoot,
        //     exclude: /node_modules|src\/components\/vue-strap/
        //   }
        // ],
        loaders: [{
                test: /vux.src.*?js$/,
                loader: 'babel'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                include: projectRoot,
                exclude: /node_modules(?![\\/]vue-awesome[\\/])/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.html$/,
                loader: 'vue-html'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                // parse css styles
                test: /\.css$/,
                loader: 'style!css'

            },
            {
                // parse scss styles
                test: /\.scss$/,
                loader: 'style!css!sass'

            },
        ]
    },
    eslint: {
        formatter: require('eslint-friendly-formatter')
    },
    vue: {
        postcss: [require('autoprefixer')({ browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8'] })],
        loaders: utils.cssLoaders()
    }
}

module.exports = vuxLoader.merge(webpackConfig, {
    plugins: ['vux-ui']
})