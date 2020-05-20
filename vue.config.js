const UglifyPlugin = require("uglifyjs-webpack-plugin");
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
const { ProgressPlugin } = require("webpack");

const devProxy = ["/api"]; // proxy route
let proEnv = require("./config/pro.env");
let devEnv = require("./config/dev.env");
const env = process.env.NODE_ENV;
// generate proxy object
let proxyObj = {};
if (env === "development") {
    devProxy.forEach((value) => {
        proxyObj[value] = {
            target: devEnv.hosturl,
            changeOrigin: true,
            pathRewrite: {
                [`^${value}`]: "",
            },
        };
    });
} else if (env === "production") {
    proxyObj = proEnv.hosturl;
}

module.exports = {
    publicPath: "./",
    lintOnSave: true,
    outputDir: "dist",
    //配置代理
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        disableHostCheck: true,
        https: false,
        hotOnly: false,
        proxy: proxyObj,
    },
    //webpack配置
    chainWebpack: (config) => {
        // console.log(config, "===>config")
        if (process.env.NODE_ENV === "development") {
            config
                .plugin("webpack-bundle-analyzer")
                .use(BundleAnalyzerPlugin)
                .end();
        }
        config
            .plugin("progress")
            .use(ProgressPlugin)
            .tap((options) => {
                options = [
                    {
                        // handler(percentage, msg) {
                        //     console.info(
                        //         percentage.toFixed(2) * 100 + "%",
                        //         msg
                        //     );
                        // },
                        profile: true,
                    },
                ];
                return options;
            });
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === "production") {
            config.mode = "production";
            let optimization = {
                minimizer: [
                    new UglifyPlugin({
                        sourceMap: true,
                        // uglifyOptions: {},
                    }),
                    new ParallelUglifyPlugin({
                        cacheDir: ".cache/",
                        uglifyJS: {
                            output: {
                                beautify: false,
                                comments: false,
                            },
                            compress: {
                                drop_console: true, // console
                                dead_code: true, //remove unreachable code
                                drop_debugger: false, //remove debugger
                                pure_funcs: ["console.log"], // remove console
                            },
                        },
                    }),
                    new TerserPlugin({
                        cache: true,
                        parallel: true,
                        sourceMap: true,
                        // terserOptions: {},
                    }),
                ],
            };
            Object.assign(config, {
                optimization,
            });
        } else {
            config.mode = "development";
        }
        Object.assign(config, {
            // 开发生产共同配置
        });
    },
    css: {
        // extract: true,
        // sourceMap: false,
        // loaderOptions: {
        //     less: {
        //     modifyVars: {
        //       'border-radius-base': '2px'
        //     },
        //     javascriptEnabled: true
        //   }},
        // requireModuleExtension: false
    },
};
