const header = (config ={}) => `
;(async () => {
    const browser = await puppeteer.launch(${config})
    let element
    // get the Page
    const [page] = await browser.pages()
`

const footer = () => `
})()
`

const writer = {
    scroll: () => `
            console.log('Here is scroll event.)
    `,
    submit: () => `
            console.log('Here is submit event.)
    `,
    $screen: (path, name) => `
            await page.screenshot({ path: '${path}/${name}.png' })
    `,
    click: (data) => `
            element = await page.$x('${data.xpath}');
            await element[0].click();
            await page.waitFor(500);
    `,
    change: (data) => `
            element = await page.$x('${data.xpath}');
            await element[0].type('${data.value}', {delay: 100});
            await page.waitFor(500);
    `
}

module.exports = {
    header,
    writer
}