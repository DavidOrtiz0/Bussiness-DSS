const mongoose = require("mongoose");
const TipSchema = require("./tip.model").schema;

module.exports = mongoose.model("TempTip", TipSchema, "temp_tip");
