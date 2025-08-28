/**
 * Modelo de Business
 * 
 * Representa un negocio registrado en Yelp.
 * Incluye ubicación, calificación, atributos flexibles
 * (ej. estacionamiento, WiFi, accesibilidad) y horarios.
 */

const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
    business_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal_code: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    stars: { type: Number, default: 0, min: 0, max: 5 },
    review_count: { type: Number, default: 0, min: 0 },
    is_open: { type: Number, enum: [0, 1], default: 1 }, // 1 abierto, 0 cerrado
    attributes: { type: mongoose.Schema.Types.Mixed, default: null }, // flexibles
    categories: { type: String, default: null },
    hours: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  { collection: "business", timestamps: true }
);

module.exports = mongoose.model("Business", BusinessSchema);
