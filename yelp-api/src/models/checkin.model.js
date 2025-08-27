const mongoose = require("mongoose");

const CheckinSchema = new mongoose.Schema({
  business_id: { type: String, required: true },
  date: { type: String } // viene como string con múltiples fechas separadas por coma
}, { collection: "checkin" });

module.exports = mongoose.model("Checkin", CheckinSchema);
