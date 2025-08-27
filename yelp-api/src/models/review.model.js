const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  review_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  business_id: { type: String, required: true },
  stars: { type: Number, required: true },
  useful: { type: Number, default: 0 },
  funny: { type: Number, default: 0 },
  cool: { type: Number, default: 0 },
  text: String,
  date: { type: Date, default: Date.now }
}, { collection: "review" });

module.exports = mongoose.model("Review", ReviewSchema);
