const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  domains: [String],
  keywords: [String],
  results: {
    type: [Schema.Types.ObjectId],
    ref: 'reportResult',
    default: [],
  },
  isLoading: {type: Boolean, default: false}
});

const ReportModel = mongoose.model("report", ReportSchema);

module.exports = ReportModel;
