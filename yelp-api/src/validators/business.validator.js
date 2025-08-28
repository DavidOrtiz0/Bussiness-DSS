/**
 * Schema de validación para documentos de la colección "Business".
 * 
 * Define la estructura principal de negocios en YelpDB.
 */

const Joi = require("joi");

const businessSchema = Joi.object({
  business_id: Joi.string().required(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().length(2).required(), // validación típica de estados US/CA
  postal_code: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  stars: Joi.number().min(0).max(5).required(),
  review_count: Joi.number().min(0).required(),
  is_open: Joi.number().valid(0, 1).required(),
  attributes: Joi.object().allow(null), // puede variar mucho, mejor dejar abierto
  categories: Joi.string().allow(null, ""), // puede ser null o string con comas
  hours: Joi.object().pattern(
    Joi.string(), // "Monday", "Tuesday"...
    Joi.string().regex(/^\d{1,2}:\d{1,2}-\d{1,2}:\d{1,2}$/) // formato HH:MM-HH:MM
  ).allow(null)
});

module.exports = businessSchema;
