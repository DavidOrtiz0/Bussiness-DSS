const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  business_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: String,
  city: String,
  state: String,
  postal_code: String,
  latitude: Number,
  longitude: Number,
  stars: { type: Number, default: 0 },
  review_count: { type: Number, default: 0 },
  is_open: { type: Number, default: 1 }, // 1 abierto, 0 cerrado
  attributes: { type: mongoose.Schema.Types.Mixed }, // flexibles
  categories: String,
  hours: { type: mongoose.Schema.Types.Mixed }
}, { collection: "business" });

module.exports = mongoose.model("Business", BusinessSchema);
