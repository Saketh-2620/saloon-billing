const Sequelize = require('sequelize');
const db = require('../config/database');
const Shop = require('./shop');

const Product = db.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    incentive: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});



Product.belongsTo(Shop, {
    foreignKey: {
        allowNull: false
    },
});

module.exports = Product;