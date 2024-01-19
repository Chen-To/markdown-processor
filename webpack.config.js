/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const DefinePlugin = require("webpack").DefinePlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const webpack = require("webpack");

module.exports = {
    entry: {
        "main": "./src/home.tsx"
    },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "home.html"),
        }),
        new ESLintWebpackPlugin({ extensions: ['js', 'jsx', 'ts', 'tsx'] }),
        new DefinePlugin({
            'process.env': {
                'APP_NAME': JSON.stringify('ToryMD')
            }
        }),
        new CleanWebpackPlugin()
    ],
    devServer: {
        static: './dist',
        port: 3000,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            },
            {
                test:/\.css$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    }
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/, 
                loader: "url-loader",
                options: { 
                    limit: 40000 
                },
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            limit: 40000,
                        },
                    },
                ],
            },
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],    
    },
}