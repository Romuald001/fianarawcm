const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Toilet = sequelize.define('Toilet', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    lat: {
        type: DataTypes.DECIMAL(10,8),
        allowNull: false
    },
    lng: {
        type: DataTypes.DECIMAL(11,8),
        allowNull: false
    },
    isFree: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    isAccessible: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    cleanliness: {
        type: DataTypes.ENUM('good', 'average', 'bad'),
        defaultValue: 'average'
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
    
}, {
    tableName: 'toilets',
    timestamps: true
});

module.exports = Toilet;