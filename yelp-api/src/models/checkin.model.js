/**
 * Modelo de Checkin
 * 
 * Registra las fechas en que usuarios hicieron "check-in"
 * en un negocio. Yelp los guarda como un string de fechas
 * separadas por coma.
 */

const mongoose = require("mongoose");

const CheckinSchema = new mongoose.Schema(
  {
    business_id: { type: String, required: true, index: true },
    // Originalmente viene como string "fecha1, fecha2,..."
    date: { type: String, required: true }
  },
  { collection: "checkin", timestamps: true }
);

module.exports = mongoose.model("Checkin", CheckinSchema);
