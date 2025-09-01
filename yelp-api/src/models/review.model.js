/**
 * Modelo de Review
 * 
 * Representa reseñas detalladas de usuarios hacia un negocio.
 * Incluye calificación en estrellas, texto de la reseña y métricas
 * de utilidad (useful, funny, cool).
 */

const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    review_id: { type: String, required: true, unique: true, index: true },
    user_id: { type: String, required: true, index: true },
    business_id: { type: String, required: true, index: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    useful: { type: Number, default: 0, min: 0 },
    funny: { type: Number, default: 0, min: 0 },
    cool: { type: Number, default: 0, min: 0 },
    text: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now }
  },
  { collection: "review", timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
