const express = require('express');
const mongoose = require('mongoose');

const { isValidURL } = require('../src/utils.js');
const { swapCommonTLDs, deleteDomainChars } = require('../src/generate_similar_domains.js');
const { dnsLookup } = require('../src/squatting_checks.js');
const { compareIcons } = require('../src/icon_check.js');
const { getSearchResultDomains } = require('../src/search_result_comparison.js');

const UserModel = require('../models/User');

const router = express.Router();

/*
 * Example:

  const domains = [
    {
      domain: req.query.domain,
      ipAddress: '192.168.1.100',
      urlConstruction: 'legitimate',
      category: 'business',
      logoDetected: true,
      riskLevel: 1,
    },
  ];

 * */
router.post('/api/domains', async (req, res) => {
  // const rawDomain = req.query.domain;
  const domains = req.body.domains;

  
  if (!domains) {
    return res.status(400);
  }

  const rawDomain = domains[0];


  if (req.path.startsWith('/api/domains') && !rawDomain) {
    return res.status(400).json({ error: 'Missing query param "domain"' });
  }
  if (!isValidURL(rawDomain)) {
    return res.status(400).json({ error: 'Invalid domain' });
  }

  let domain;

  if (rawDomain.startsWith('http://') || rawDomain.startsWith('https://')) {
    domain = new URL(rawDomain).host;
  } else{
    domain = new URL('http://' + rawDomain).host;
  }

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
      detectedInSearch: false,
      riskLevel: 1,
      redirectToOriginal: false
    });
  }

  for (let charDeletion of charDeletions) {
    allRecords.push({
      domain: charDeletion,
      ipAddress: '',
      urlConstruction: 'Character deletion',
      category: 'unknown',
      logoDetected: false,
      detectedInSearch: false,
      riskLevel: 1,
      redirectToOriginal: false
    });
  }

  for (let record of allRecords) {
    const ip = await dnsLookup(record.domain);
    if (ip !== null) {
      record.ipAddress = ip;
      result.push(record);
    }
  }

  // Check search engine for other associated with original domain
  const fullDomainSearch = await getSearchResultDomains(domain);
  const domainNameSearch = await getSearchResultDomains(domain.split('/')[0]);

  for (let record of result) {
    record.logoDetected = await compareIcons(domain, record.domain);
    record.detectedInSearch = fullDomainSearch.has(record.domain) || domainNameSearch.has(record.domain);
    
    if (record.logoDetected && record.detectedInSearch) {
      record.riskLevel = 5;
    } else if (record.logoDetected) {
      record.riskLevel = 2;
    } else if (record.detectedInSearch) {
      record.riskLevel = 2;
    }
  }

  res.json(result);
});

router.get('/api/user_records', (req, res) => {
  // return res.status(404).send('No records for user.');
  return res.json({
    domains: ['google.net', 'google.com'],
    keywords: ['your', 'mom'],
    records: []
  })
});

module.exports = router;
