const mongoose = require("mongoose");
const BusinessSchema = require("./business.model").schema;

module.exports = mongoose.model("TempBusiness", BusinessSchema, "temp_business");
