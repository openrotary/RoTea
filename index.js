// const Listener = require('./src/listener')
const Listener = require('./src/starter')

Listener({
  headless: false,
  devtools: false,
  viewWidth: 1920,
  viewHeight: 1080,
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  indexPath: 'http://www.baidu.com',
  ignoreDefaultArgs: ['--enable-automation']
})
