const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const path = require('path');

const distDir = path.resolve(__dirname, 'dist');

module.exports = {
    entry: './src/scripts/app.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css']
    },
    output: {
        filename: 'main_bundle.js',
        path: (distDir)
    },
    plugins: [
        new CleanWebpackPlugin([distDir]),
        new HtmlWebpackPlugin({
            template: 'src/html/index.html'
        }),
        new FileManagerPlugin({
            onEnd: {
                copy: [
                    {
                        source: path.resolve(__dirname, 'assets'),
                        destination: path.resolve(__dirname, distDir) + '/assets'
                    }
                ]
            }
        })],
    externals: {
        'pixi.js': 'PIXI',
    },
};