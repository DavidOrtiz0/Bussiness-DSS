const mongoose = require("mongoose");
const CheckinSchema = require("./checkin.model").schema;

module.exports = mongoose.model("TempCheckin", CheckinSchema, "temp_checkin");
