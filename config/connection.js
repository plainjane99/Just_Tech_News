// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

// don't need to save this require to a variable. just execute it.
require('dotenv').config();

// commented out local connect code that we hardcoded to work locally
// create connection to our database, pass in your MySQL information for username and password
// const sequelize = new Sequelize('just_tech_news_db', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
//   port: 3306
// });

// this code is required for deployment to heroku
let sequelize;

// when deployed, app will have access to heroku's process.env.JAWSDB_URL so
// it will use that to connect
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  // otherwise use our localhost
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
}

module.exports = sequelize;