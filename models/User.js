const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  keywords: {
    type: [String],
    default: []
  },
  domains: {
    type: [String],
    default: []
  },
  reports: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'report'
  }
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
