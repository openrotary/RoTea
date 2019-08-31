const Koa = require('koa');
const static = require('koa-static')
const fs = require('fs')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const app = new Koa();
const router = require('./router')


app
.use(static(path.join(__dirname,'../client/dist')))
.use( (ctx) => {
  ctx.body = fs.readFileSync(path.join(__dirname,'../client/dist/index.html'))
})
.use(cors())
.use(bodyParser())
.use(router.routes())
.use(router.allowedMethods())

const server = require('http').Server(app.callback())
const io = require('socket.io')(server)

server.listen(4190, () => console.log('Start Server in 4190 port'))

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
