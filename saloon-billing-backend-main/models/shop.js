const Sequelize = require('sequelize');
const db = require('../config/database');
const ShopGroup = require('./shopGroup');

const Shop = db.define('shop', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});


Shop.belongsTo(ShopGroup, {
    foreignKey: {
        allowNull: false
    },
});



module.exports = Shop;