let hosturl = 'http://192.168.235.59:8090'
const mode = process.argv[process.argv.length - 1]
if (mode === '--mock') {
  hosturl = 'http://localhost:3004'
}
console.log(hosturl)
// 本地环境
module.exports = {
  NODE_ENV: 'development',
  hosturl: hosturl
}
