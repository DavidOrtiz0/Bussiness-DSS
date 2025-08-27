const mongoose = require("mongoose");

const TipSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  business_id: { type: String, required: true },
  text: String,
  date: { type: Date, default: Date.now },
  compliment_count: { type: Number, default: 0 }
}, { collection: "tip" });

module.exports = mongoose.model("Tip", TipSchema);
