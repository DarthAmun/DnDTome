const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = [SRC_DIR];

module.exports = {
    entry: {
        race: [
            SRC_DIR + '/race.js',
        ],
        char: [
            SRC_DIR + '/char.js',
        ],
        monster: [
            SRC_DIR + '/monster.js',
        ],
        spell: [
            SRC_DIR + '/spell.js',
        ],
        item: [
            SRC_DIR + '/item.js',
        ],
        gear: [
            SRC_DIR + '/gear.js',
        ],
        main: [
            SRC_DIR + '/index.js',
        ]
    },
    output: {
        path: OUTPUT_DIR,
        publicPath: './',
        filename: '[name].js'
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                }),
                include: defaultInclude
            },
            {
                test: /\.jsx?$/,
                use: [{ loader: 'babel-loader' }],
                include: defaultInclude
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
                include: defaultInclude
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
                include: defaultInclude
            }
        ]
    },
    target: 'electron-renderer',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            filename: 'spell.html',
            template: 'src/index.html',
            chunks: ['spell']
        }),
        new HtmlWebpackPlugin({
            filename: 'item.html',
            template: 'src/index.html',
            chunks: ['item']
        }),
        new HtmlWebpackPlugin({
            filename: 'gear.html',
            template: 'src/index.html',
            chunks: ['gear']
        }),
        new HtmlWebpackPlugin({
            filename: 'monster.html',
            template: 'src/index.html',
            chunks: ['monster']
        }),
        new HtmlWebpackPlugin({
            filename: 'char.html',
            template: 'src/index.html',
            chunks: ['char']
        }),
        new HtmlWebpackPlugin({
            filename: 'race.html',
            template: 'src/index.html',
            chunks: ['race']
        }),
        new ExtractTextPlugin({ filename: '[name].css' }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new BabiliPlugin()
    ],
    stats: {
        colors: true,
        children: false,
        chunks: false,
        modules: false
    }
};