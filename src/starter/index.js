const puppeteer = require('puppeteer')
const keeper = require('../keeper')
const { eventList } = require('../utils')

/**
 * Run the listener.
 *
 * @param {object} options - Configure of the puppeteer.
 */
async function Listener(options) {
  const browser = await puppeteer.launch(options)

  // get the Page
  const [page] = await browser.pages()

  // set view size
  await page.setViewport({
    width: options.viewWidth,
    height: options.viewHeight
  })
  // 设置全局方法
  await page.exposeFunction('onCustomScroll', async e => {
    keeper.keep({ eventType: 'scroll' })
  })
  await page.exposeFunction('onCustomMethod', async (e, info) => {
    if (!['click'].includes(e.eventType)) {
      // focus 、blur 、submit、change、select 等事件无法往下走，可以在此处进行保存，只有click事件能够往下走
      keeper.keep({ ...e, ...info })
      return
    }
    const xpath = await page.evaluate(info => {
      // get element by coordinate
      let element = document.elementFromPoint(info.x, info.y)
      if (element && element.id) return '//*[@id="' + element.id + '"]'
      let paths = []
      // Use nodeName (instead of localName) so namespace prefix is included (if any).
      for (
        ;
        element && element.nodeType == Node.ELEMENT_NODE;
        element = element.parentNode
      ) {
        let index = 0,
          hasFollowingSiblings = false
        for (
          let sibling = element.previousSibling;
          sibling;
          sibling = sibling.previousSibling
        ) {
          // Ignore document type declaration.
          if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE) continue
          if (sibling.nodeName == element.nodeName) ++index
        }
        for (
          let sibling = element.nextSibling;
          sibling && !hasFollowingSiblings;
          sibling = sibling.nextSibling
        ) {
          sibling.nodeName === element.nodeName && (hasFollowingSiblings = true)
        }
        let tagName =
          (element.prefix ? `${element.prefix}:` : '') + element.localName
        let pathIndex = index || hasFollowingSiblings ? `[${index + 1}]` : ''
        paths.splice(0, 0, tagName + pathIndex)
      }
      return paths.length ? '/' + paths.join('/') : null
    }, info)
    keeper.keep({ xpath, ...e, ...info })
  })

  const listenForScroll = type => {
    page.evaluateOnNewDocument(type => {
      document.addEventListener(
        type,
        e => {
          window.onCustomScroll(e)
        },
        true
      )
    }, type)
  }
  function listenFor(type) {
    // 该钩子在页面导航后触发
    page.evaluateOnNewDocument(type => {
      // 监听事件
      document.addEventListener(
        type,
        e => {
          window.onCustomMethod(
            {
              eventType: type,
              type: e.target.type,
              target: e.target.tagName.toLowerCase(),
              value: e.target.value,
              times: Date.now()
            },
            {
              x: e.clientX,
              y: e.clientY
            }
          )
        },
        true
      )
    }, type)
  }

  eventList.forEach(event => {
    switch (event) {
      case 'scroll':
        listenForScroll(event)
        break
      default:
        listenFor(event)
    }
  })

  // If have index path, then go to.
  if (options.indexPath) {
    await page.goto(options.indexPath, { waitUntil: 'networkidle2' })
  }
  // page.close()
}

module.exports = Listener
