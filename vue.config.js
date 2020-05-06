const UglifyPlugin = require("uglifyjs-webpack-plugin");

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
    chainWebpack: () => {
        // console.log(config, "===>config")
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === "production") {
            config.mode = "production";
            let optimization = {
                minimizer: [
                    new UglifyPlugin({
                        sourceMap: true,
                        uglifyOptions: {
                            compress: {
                                drop_console: true, // console
                                dead_code: true, //remove unreachable code
                                drop_debugger: false, //remove debugger
                                pure_funcs: ["console.log"], // remove console
                            },
                        },
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
