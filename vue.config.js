const devProxy = ['/api'];  // proxy route
let proEnv = require('./config/pro.env');
let devEnv = require('./config/dev.env');
const env = process.env.NODE_ENV;
// generate proxy object
let proxyObj = {};
if (env === 'development') {
    devProxy.forEach((value) => {
        proxyObj[value] = {
            target: devEnv.hosturl,
            changeOrigin: true,
            pathRewrite: {
                [`^${value}`]: ""
            }
        };
    });
} else if (env === 'production') {
    proxyObj = proEnv.hosturl
}

module.exports = {
    publicPath: './',
    lintOnSave: true,
    outputDir: 'dist',
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        disableHostCheck: true,
        https: false,
        hotOnly: false,
        proxy: proxyObj,
    }
};