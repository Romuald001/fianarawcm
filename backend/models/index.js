const sequelize = require('../config/config');

const User = require('./UserModel');
const Toilet = require('./ToiletModel');

User.hasMany(Toilet, { foreignKey: 'createdBy', onDelete: 'SET NULL' });
Toilet.belongsTo(User, { foreignKey: 'createdBy' });

module.exports = { sequelize, User, Toilet };