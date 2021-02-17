const puppeteer = require('puppeteer');
const fileSystem = require('fs');

const interval = 1000;
//Uncomment the following line to update the scraper data once in a week
// const interval = 604800000


setInterval(async () => {
  const BASE_URL = 'https://stockbangladesh.com/dse/stock/beximco/bangladesh-export-import-co-limited/fundamental/details';

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


  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitFor(60000);

  const sectorDetails = await page.evaluate(() => {
    const yearlyNavSelector = Array.from(document.querySelectorAll('#yearly_nav36 .highcharts-point.highcharts-color-0'));
    const YearlyNav = yearlyNavSelector.map(data => ({yearInterval: data.point.category, netAssetValue: data.point.y}))

    const yearlyEPSSelector = Array.from(document.querySelectorAll('#yearly_eps36 .highcharts-point.highcharts-color-0'));
    const YearlyEPS = yearlyEPSSelector.map(data => ({yearInterval: data.point.category, earningPerShare: data.point.y}))

    const dividendHistorySelector = Array.from(document.querySelectorAll('#divident_possible_36 .highcharts-series-group .highcharts-point'));
    const DividendHistory = [];
    for(let i=0; i < dividendHistorySelector.length/2; i++){
      const stockInfo = dividendHistorySelector[i];
      const cashInfo = dividendHistorySelector[(dividendHistorySelector.length/2) + i];

      DividendHistory.push({
        year: stockInfo.point.category,
        total: stockInfo.point.total,
        stockDividend: stockInfo.point.y,
        cashDividend: cashInfo.point.y
      })
    }

    return {
      DividendHistory,
      YearlyNav,
      YearlyEPS
    }
  })
  fileSystem.writeFile(`${__dirname}/sector-details.json`, JSON.stringify(sectorDetails), err => {
    if(err){
      throw err;
    }
  })
  await browser.close();

},interval);