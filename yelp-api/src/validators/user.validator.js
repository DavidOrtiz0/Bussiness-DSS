/**
 * Schema de validación para documentos de la colección "User".
 * 
 * Este esquema asegura que todos los campos de usuario cumplan
 * con el formato esperado en la base de datos YelpDB.
 */

const Joi = require("joi");

const userSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "any.required": "El campo user_id es obligatorio"
  }),
  name: Joi.string().required(),
  review_count: Joi.number().min(0).required(),
  yelping_since: Joi.string().required(), // se podría usar regex ISO8601 si quieres validación estricta
  useful: Joi.number().min(0).required(),
  funny: Joi.number().min(0).required(),
  cool: Joi.number().min(0).required(),
  elite: Joi.string().allow(null, ""), // algunos usuarios no son elite
  friends: Joi.array().items(Joi.string()).allow(null) // mejor declarar como arreglo de user_ids
});

module.exports = userSchema;
