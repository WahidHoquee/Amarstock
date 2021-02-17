const puppeteer = require('puppeteer');

const getSectorDetails = async (req, res) => {
  const BASE_URL = `https://stockbangladesh.com/dse/stock/${req.params.company}/bangladesh-export-import-co-limited/fundamental/details`;

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
  await page.waitFor(180000);
  // await page.waitForNavigation('domcontentloaded')

  const sectorDetails = await page.evaluate(() => {
    let yearlyNavID, yearlyEPSID, dividentID;

    const selectors = Array.from(document.querySelectorAll('.portlet-body'))
    for(let i=0; i < selectors.length; i++){
      if(selectors[i].children[0]){
        if(selectors[i].children[0].id.includes('yearly_nav')){
          yearlyNavID = selectors[i].children[0].id
        }
        else if(selectors[i].children[0].id.includes('yearly_eps')){
          yearlyEPSID = selectors[i].children[0].id
        }
        else if(selectors[i].children[0].id.includes('divident_possible')){
          dividentID = selectors[i].children[0].id
        }
      }
    }

    const yearlyNavSelector = Array.from(document.querySelectorAll(`#${yearlyNavID} .highcharts-point.highcharts-color-0`));
    const YearlyNav = yearlyNavSelector.map(data => ({yearInterval: data.point.category, netAssetValue: data.point.y}))

    const yearlyEPSSelector = Array.from(document.querySelectorAll(`#${yearlyEPSID} .highcharts-point.highcharts-color-0`));
    const YearlyEPS = yearlyEPSSelector.map(data => ({yearInterval: data.point.category, earningPerShare: data.point.y}))

    const dividendHistorySelector = Array.from(document.querySelectorAll(`#${dividentID} .highcharts-series-group .highcharts-point`));
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

  await browser.close();
  res.send({...sectorDetails, Company: req.params.company})
}

module.exports = getSectorDetails;