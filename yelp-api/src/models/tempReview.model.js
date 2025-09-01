const mongoose = require("mongoose");
const ReviewSchema = require("./review.model").schema;

module.exports = mongoose.model("TempReview", ReviewSchema, "temp_review");

