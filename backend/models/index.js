const sequelize = require('../config/config');

const User = require('./UserModel');
const Toilet = require('./ToiletModel');



module.exports = { sequelize, User, Toilet };