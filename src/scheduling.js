const schedule = require('node-schedule');

const { dnsLookup, fullSquattingCheck } = require('../src/squatting_checks.js');

const UserModel = require('../models/User');
const ReportModel = require('../models/Report.js');
const ReportResultModel = require('../models/ReportResult.js');

// Deletes report and all associated results
async function deleteReport(id) {
  const report = await ReportModel.findOne({ _id: id });
  if (report === null) {
    return;
  }
  for (let resultId of report.results) {
    if (await ReportResultModel.findOne({ _id: resultId })) {
      await ReportResultModel.deleteOne({ _id: resultId });
    }
  }
  await ReportModel.deleteOne({ _id: id });
}


/*
 * Schedules analysis jobs for all users.
 * Meant to be used when the server is started.
 * */
async function scheduleAllJobs() {
  const users = await UserModel.find();
  for (let originalUser of users) {
    const job = schedule.scheduleJob('*/30 * * * *', async function() {
      const user = await UserModel.findOne({ username: originalUser.username });
      if (user.domains) {
        console.log(`Background analysis for ${user.username}`);

        const result = await fullSquattingCheck(user.domains, user.keywords);

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
          domains: user.domains,
          keywords: user.keywords,
          results: reportResultIds
        });
        await report.save();

        await UserModel.updateOne({ username: user.username }, {
          report: report._id
        }).exec();
        console.log(`finished background analysis for ${user.username}`);
      }
    });
  }
}

module.exports = { scheduleAllJobs };
