// const Listener = require('./src/listener')
const Listener = require('./src/starter')

Listener({
  headless: false,
  devtools: false,
  viewWidth: 1920,
  viewHeight: 1080,
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  indexPath: 'http://127.0.0.1:3000',
  ignoreDefaultArgs: ['--enable-automation']
})
