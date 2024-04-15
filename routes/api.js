const express = require('express');
const mongoose = require('mongoose');

const { isValidURL } = require('../src/utils.js');
const { swapCommonTLDs, deleteDomainChars } = require('../src/generate_similar_domains.js');
const { dnsLookup } = require('../src/squatting_checks.js');
const { compareIcons } = require('../src/icon_check.js');
const { getSearchResultDomains } = require('../src/search_result_comparison.js');

const UserModel = require('../models/User');
const ReportModel = require('../models/Report.js');
const ReportResultModel = require('../models/ReportResult.js');

const router = express.Router();

function arrayCompare(arr1, arr2) {
  if (!(arr1.length === arr2.length)) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

// Deletes report and all associated results
async function deleteReport(id) {
  const report = await ReportModel.findOne({_id: id});
  for (let resultId in report.results) {
    await ReportResultModel.deleteOne({_id: resultId});
  }
  await ReportModel.deleteOne({_id: id});
}

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
  if (!req.user) {
    return res.status(401).send();
  }
  // const rawDomain = req.query.domain;
  const domains = req.body.domains;
  const keywords = req.body.keywords;

  // check database to see if user already has records with these domains + keywords
  const user = await UserModel.findOne({username: req.user.username});

  if (user.report) {
    const report = await ReportModel.findOne({ _id: user.report });
    if (arrayCompare(domains, report.domains) && arrayCompare(keywords, report.keywords)) {
      console.log(domains, report.domains);
      const records = [];
      for (let id of report.results) {
        const result = await ReportResultModel.findOne({ _id: id });
        if (result) {
          records.push(result);
        }
      }
      return res.json(records);
    }
  }

  
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

  await deleteReport(user.report) // delete user's previous report
  // update DB
  const reportResultIds = [];
  for (let record of result) {
    const recordInstance = new ReportResultModel(record);
    await recordInstance.save();
    reportResultIds.push(recordInstance._id);
  }

  const report = new ReportModel({
    domains: req.body.domains,
    keywords: req.body.keywords,
    results: reportResultIds
  });
  await report.save();

  await UserModel.updateOne({username: req.user.username}, {
    report: report._id
  }).exec();

});

router.get('/api/user_records', async (req, res) => {
  // return res.status(404).send('No records for user.');
  if (!req.user) {
    return res.status(404).send('No user');
  }
  const userInstance = await UserModel.findOne({username: req.user.username});
  if (!userInstance.report) {
    return res.status(404).send('No report for user.');
  }
  const reportInstance = await ReportModel.findOne({_id: userInstance.report});
  console.log(userInstance.report)
  if (!reportInstance) {
    return res.status(404).send('No report for user.');
  }
  const records = [];
  for (let id of reportInstance.results) {
    const record = await ReportResultModel.findOne({_id: id});
    if (record) {
      records.push(record);
    }
  }
  return res.json({
    domains: reportInstance.domains,
    keywords: reportInstance.keywords,
    records: records
  })
});

module.exports = router;
