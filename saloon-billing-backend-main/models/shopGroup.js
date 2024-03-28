const Sequelize = require('sequelize');
const db = require('../config/database');

const ShopGroup = db.define('shopGroup', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = ShopGroup;