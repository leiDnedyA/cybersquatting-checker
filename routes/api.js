const express = require('express');
const mongoose = require('mongoose');

const { isValidURL } = require('../src/utils.js');
const { swapCommonTLDs, deleteDomainChars } = require('../src/generate_similar_domains.js');
const { dnsLookup, fullSquattingCheck } = require('../src/squatting_checks.js');
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
  console.log(report.results)
  if (!report) {
    return;
  }
  for (let resultId of report.results) {
    if (await ReportResultModel.findOne({_id: resultId})) {
      await ReportResultModel.deleteOne({_id: resultId});
    }
  }
  await ReportModel.deleteOne({_id: id});
}

router.post('/api/domains', async (req, res) => {
  if (!req.user) {
    return res.status(401).send();
  }
  // const rawDomain = req.query.domain;
  const domains = req.body.domains;
  const keywords = req.body.keywords;

  // check database to see if user already has records with these domains + keywords
  const user = await UserModel.findOne({username: req.user.username});

  if (!domains) {
    return res.status(400);
  }
  for (let domain of domains) {
    if (!isValidURL(domain)) {
      return res.status(400).json({ error: `Invalid domain "${domain}"`});
    }
  }

  if (user.report) {
    const report = await ReportModel.findOne({ _id: user.report });
    if (arrayCompare(domains, report.domains) && arrayCompare(keywords, report.keywords)) {
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
  
  const result = await fullSquattingCheck(domains, keywords);

  res.json(result);

  if (user.report) {
    await deleteReport(user.report) // delete user's previous report
  }
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
    report: report._id,
    domains: domains,
    keywords: keywords
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
