const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// 抽离的项目依赖
const vendors = [
    "vue",
    "vue-router",
    "vuex",
    "moment",
    "lodash",
    "axios",
    "ant-design-vue",
];
module.exports = {
    mode: "production",
    entry: {
        vendors: vendors,
    },
    // dll输出目录
    output: {
        path: path.join(__dirname, "../public", "vendor"),
        filename: "[name].[chunkhash].dll.js",
        library: "[name]_[chunkhash]",
    },
    resolve: {
        extensions: [".js", ".vue", ".json", ".less"],
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                query: {
                    limit: 10000,
                    name: "img/[name].[hash:7].[ext]",
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                query: {
                    limit: 10000,
                    name: "fonts/[name].[hash:7].[ext]",
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        // dll输出文件*.manifest.json *.js
        new webpack.DllPlugin({
            path: path.join(
                __dirname,
                "../public",
                "vendor",
                "[name].manifest.json"
            ),
            name: "[name]_[chunkhash]",
        }),
    ],
    // optimization: {
    //     minimize: false,
    // },
};
