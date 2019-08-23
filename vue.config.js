module.exports = {
    publicPath: './',
    outputDir: 'dist',
    lintOnSave: true,
    productionSourceMap: false,
    devServer: {
        host: '0.0.0.0',
        port: '8080',
        disableHostCheck: true,
        https: false,
        hotOnly: false,
        //proxy
        proxy: {
            '/api': {
                target: 'http://localhost:3004',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}