const Router = require('koa-router')
const router = new Router()
const fs = require('fs')

router
.post('/api/pushLog', (ctx, next) => {
    // req
    const { log } = ctx.request.body
    // todo 生成代码
    // res
    ctx.response.type = 'json'
    ctx.response.body = { success: true }
})

module.exports = router
