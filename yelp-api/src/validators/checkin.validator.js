/**
 * Schema de validación para documentos de la colección "Checkin".
 * 
 * Registra fechas de visitas de usuarios a un negocio.
 */

const Joi = require("joi");

const checkinSchema = Joi.object({
  business_id: Joi.string().required(),
  date: Joi.string().required() // en el dataset original puede venir concatenado, lo dejamos flexible
});

module.exports = checkinSchema;
