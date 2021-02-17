const puppeteer = require('puppeteer');
const fileSystem = require('fs');


const interval = 10000;
//Uncomment the following line to update the scraper data once in a week
// const interval = 604800000

setInterval(async () => {
  const BASE_URL = 'https://stockbangladesh.com/sector-pe';

  const browser = await puppeteer.launch({
      headless: false
  });
  
  const page = await browser.newPage();
  await page.goto(BASE_URL);
  await page.waitForSelector('.table')

  let tableRowsArray = await page.$$('.table > tbody > tr')
  const sectorPE = []
  for (let row of tableRowsArray){
    let sector = await row.$eval('td:nth-child(1)', el => el.innerText)
    let pe = await row.$eval('td:nth-child(4)', el => el.innerText)
    sectorPE.push({SECTOR: sector, 'SECTOR P/E': pe})
  }
  fileSystem.writeFile(`${__dirname}/sector-pe.json`, JSON.stringify(sectorPE), err => {
    if(err){
      throw err;
    }
  })
  await browser.close();

}, interval);



