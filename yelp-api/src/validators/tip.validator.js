/**
 * Schema de validación para documentos de la colección "Tip".
 * 
 * Representa consejos breves de usuarios hacia negocios.
 */

const Joi = require("joi");

const tipSchema = Joi.object({
  user_id: Joi.string().required(),
  business_id: Joi.string().required(),
  text: Joi.string().max(1000).required(), // límite razonable para no cargar demasiado
  date: Joi.string().required(), // formato ISO recomendado
  compliment_count: Joi.number().min(0).required()
});

module.exports = tipSchema;
