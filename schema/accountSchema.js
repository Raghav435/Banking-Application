const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema({
  code: String,
  name: String,
  balance: Number,
});
module.exports = accountSchema;
