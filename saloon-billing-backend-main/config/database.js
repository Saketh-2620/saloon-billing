const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
        ssl: process.env.ENVIRONMENT === 'render' ? false : true,
      },
    port: 5432,
});

  module.exports = sequelize;