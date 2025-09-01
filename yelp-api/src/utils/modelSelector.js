// src/utils/modelSelector.js
const Business = require("../models/business.model");
const TempBusiness = require("../models/tempBusiness.model");

const Review = require("../models/review.model");
const TempReview = require("../models/tempReview.model");

const User = require("../models/user.model");
const TempUser = require("../models/tempUser.model");

const Tip = require("../models/tip.model");
const TempTip = require("../models/tempTip.model");

const Checkin = require("../models/checkin.model");
const TempCheckin = require("../models/tempCheckin.model");

/**
 * Devuelve el modelo correcto según colección y query param
 * @param {string} collection - Nombre base de la colección (business, review, user, tip, checkin)
 * @param {boolean} useTemp - true si debe usar la colección temporal
 */
function getModel(collection, useTemp) {
  const models = {
    business: useTemp ? TempBusiness : Business,
    review: useTemp ? TempReview : Review,
    user: useTemp ? TempUser : User,
    tip: useTemp ? TempTip : Tip,
    checkin: useTemp ? TempCheckin : Checkin,
  };

  return models[collection];
}

module.exports = { getModel };
