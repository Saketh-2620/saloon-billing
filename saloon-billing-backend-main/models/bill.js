const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');
const Shop = require('./shop');


const Bill = db.define('bill', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    discount: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    rating: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    tip: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    customerName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isMale: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    customerPhone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    modeOfPayment: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

Bill.belongsTo(Employee, {
    foreignKey: {
        allowNull: false
    },
});

Bill.belongsTo(Shop, {
    foreignKey: {
        allowNull: false
    },
});

module.exports = Bill;