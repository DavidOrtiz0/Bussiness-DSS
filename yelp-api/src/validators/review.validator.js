/**
 * Schema de validación para documentos de la colección "Review".
 * 
 * Contiene reseñas completas con texto, calificación y métricas sociales.
 */

const Joi = require("joi");

const reviewSchema = Joi.object({
  review_id: Joi.string().required(),
  user_id: Joi.string().required(),
  business_id: Joi.string().required(),
  stars: Joi.number().min(1).max(5).required(),
  useful: Joi.number().min(0).required(),
  funny: Joi.number().min(0).required(),
  cool: Joi.number().min(0).required(),
  text: Joi.string().required(),
  date: Joi.string().required() // idealmente validación con formato de fecha
});

module.exports = reviewSchema;
