const puppeteer = require('puppeteer');
const fileSystem = require('fs');

(async () => {
  const BASE_URL = 'https://stockbangladesh.com/dse/stock/beximco/bangladesh-export-import-co-limited/fundamental/details';

  const browser = await puppeteer.launch({
      headless: false
  });
  
  const page = await browser.newPage();
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });


  const data = await page.evaluate(() => {
    const images = document.querySelectorAll("body > div.wrapper > div > div > div.breadcrumbs.hidden-xs.hidden-sm > h1:nth-child(1)").innerText;
    return images;
  })
// const windowHandle = await page.evaluateHandle(() => window);

// const result = await page.evaluate(() => JSON.stringify(Highcharts)));
//   console.log(JSON.parse(result)); // it will log the string 'Example Domain'
  // console.log(await page.evaluate(() => {
  //   console.log(document)
  // }))
  // console.log(data)
  // const handle = await page.evaluateHandle(() => ({window, document}));
  // const properties = await handle.getProperties();
  // const windowHandle = properties.get('window');
  // const documentHandle = properties.get('document');
  // var result = await page.evaluate(win => win, windowHandle);
  // console.log(result)

  // await handle.dispose()
    debugger;
  await browser.close();

})();