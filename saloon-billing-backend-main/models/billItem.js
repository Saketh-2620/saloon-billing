const Sequelize = require('sequelize');
const db = require('../config/database');
const Bill = require('./bill');
const Product = require('./product');


const BillItem = db.define('billItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    incentive: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
});

BillItem.belongsTo(Bill, {
    foreignKey: {
        allowNull: false
    },
});

BillItem.belongsTo(Product, {
    foreignKey: {
        allowNull: false
    },
});

module.exports = BillItem;