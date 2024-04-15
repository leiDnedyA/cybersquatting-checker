const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  domain: String,
  ipAddress: String,
  urlConstruction: String,
  detectedInSearch: Boolean,
  logoDetected: Boolean,
  riskLevel: Number
});

const ReportModel = mongoose.model("report", ReportSchema);

module.exports = ReportModel;
