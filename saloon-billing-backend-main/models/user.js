const Sequelize = require('sequelize');
const db = require('../config/database');
const Shop = require('./shop');
const ShopGroup = require('./shopGroup');


const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [['ADMIN', 'SHOP_GROUP_MANAGER', 'SHOP_MANAGER']],
          }
    }
});


User.belongsTo(Shop, {
    foreignKey: {
      allowNull: true, // Allow null only if RoleName is 'admin'
    },
    constraints: false, // Disable constraints for this association
  });

User.belongsTo(ShopGroup, {
  foreignKey: {
      allowNull: true, // Allow null only if the user has a shop group manager role
  }
});

module.exports = User;