# Amar-Stock Data Scrapping!

## TO CREATE NODEJS ENVIRONMENT & START THE EXPRESSJS SERVER

 1. Open Terminal in the context of Project Folder
 2. You must have nodeJS installed.
 3. RUN: npm install
 4. RUN: npm start
 5. Then you can start consuming the following API endpoints

## API ENDPOINTS

 - http://localhost:8080/api/sector-pe
 - http://localhost:8080/api/sector-details/acmelab

> For safety issue (So that DOM can load fully), It waits for 3 minute to make sure that the whole content is loaded


## SCRAPE DATA AND STORE IT IN JSON FILE
You may run the following scripts to generate a JSON file instead of consuming API:

 - npm run sector-pe
 - npm run sector-details -> (By default It will consume Beximco)

