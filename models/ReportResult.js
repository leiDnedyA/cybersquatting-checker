const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReportResultSchema = new Schema({
  domain: [String],
  ipAddress: [String],
  urlConstruction: String,
  logoDetected: Boolean,
  detectedInSearch: Boolean,
  riskLevel: Number
});

const ReportResultModel = mongoose.model("reportResult", ReportResultSchema);

module.exports = ReportResultModel;
