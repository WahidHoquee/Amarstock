const puppeteer = require('puppeteer');

const getSectorPE = async (req, res) => {
  const BASE_URL = 'https://stockbangladesh.com/sector-pe';

  const browser = await puppeteer.launch({
      headless: false
  });
  
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if(['image', 'stylesheet', 'font'].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  })

  await page.goto(BASE_URL);
  await page.waitForSelector('.table')

  let tableRowsArray = await page.$$('.table > tbody > tr')

  const sectorPE = []
  for (let row of tableRowsArray){
    let sector = await row.$eval('td:nth-child(1)', el => el.innerText)
    let pe = await row.$eval('td:nth-child(4)', el => el.innerText)
    sectorPE.push({SECTOR: sector, 'SECTOR P/E': pe})
  }
  res.send(sectorPE)
}

module.exports = getSectorPE;



