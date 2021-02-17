const express = require('express');
const getSectorDetails = require('./controller/getSectorDetails');
const getSectorPE = require('./controller/getSectorPE');

const app = express();

app.use(express.json());

app.get('/api/sector-pe', getSectorPE)

app.get('/api/sector-details/:company', getSectorDetails)

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`))

// http://localhost:8080/api/sector-pe