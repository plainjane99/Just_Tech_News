// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

// don't need to save this require to a variable. just execute it.
require('dotenv').config();

// create connection to our database, pass in your MySQL information for username and password
const sequelize = new Sequelize('just_tech_news_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;