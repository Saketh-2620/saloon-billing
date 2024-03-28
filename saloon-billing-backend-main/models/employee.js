const Sequelize = require('sequelize');
const db = require('../config/database');
const ShopGroup = require('./shopGroup');


const Employee = db.define('employee', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Employee.belongsTo(ShopGroup, {
    foreignKey: {
        allowNull: false
    },
});

module.exports = Employee;