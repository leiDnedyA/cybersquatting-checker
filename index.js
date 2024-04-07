const express = require('express');
const cors = require('cors');

const { isValidURL } = require('./src/utils.js');
const { swapCommonTLDs, deleteDomainChars } = require('./src/generate_similar_domains.js');
const { dnsLookup } = require('./src/squatting_checks.js');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


/* Middleware */

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  const domain = req.query.domain;
  if (!isValidURL(domain)) {
    return res.status(400).json({ error: 'Invalid domain' });
  }
  next();
});


/* Routes */

app.get('/api/domains', async (req, res) => {

  const rawDomain = req.query.domain;

  let domain;

  if (rawDomain.startsWith('http://') || rawDomain.startsWith('https://')) {
    domain = new URL(rawDomain).host;
  } else{
    domain = new URL('http://' + rawDomain).host;
  }

  console.log(`Request made for domain "${domain}"`);

  // // Example:
  // const domains = [
  //   {
  //     domain: req.query.domain,
  //     ipAddress: '192.168.1.100',
  //     urlConstruction: 'legitimate',
  //     category: 'business',
  //     logoDetected: true,
  //     riskLevel: 1,
  //   },
  // ];

  const result = []; // return value, only records with URLS that don't 404
  const allRecords = []; // stores all records, even those that 404

  const tldSwaps = swapCommonTLDs(domain);
  const charDeletions = deleteDomainChars(domain);
  
  for (let tldSwap of tldSwaps) {
    allRecords.push({
      domain: tldSwap,
      ipAddress: '',
      urlConstruction: 'New TLD',
      category: 'unknown',
      logoDetected: false,
      riskLevel: 5
    });
  }

  for (let charDeletion of charDeletions) {
    allRecords.push({
      domain: charDeletion,
      ipAddress: '',
      urlConstruction: 'Character deletion',
      category: 'unknown',
      logoDetected: false,
      riskLevel: 5
    });
  }

  for (let record of allRecords) {
    const ip = await dnsLookup(record.domain);
    if (ip !== null) {
      result.push(record);
    }
  }

  res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
