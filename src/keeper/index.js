const app = require('http')
  .createServer()
  .listen(4190)
const io = require('socket.io')(app)
console.log('Start Server in 4190 port')

io.on('connection', socket => {
  console.log('socket连接成功')
})

class Keeper {
  constructor() {
    this.keepStack = []
    this.xpathCache = ''
  }
  keep(data) {
    const _type = data.eventType
    if (['click'].includes(_type)) {
      this.xpathCache = data.xpath
    }
    if (['change'].includes(_type)) {
      data.xpath = this.xpathCache
    }
    this.keepStack.push(data)
    io.emit('log', data)
    // console.log(this.keepStack)
  }
}

module.exports = new Keeper()
