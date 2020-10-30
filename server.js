const express = require('express');
// the files at this path collects everything for us to use in server.js
const routes = require('./routes');
// importing the connection to Sequelize from noted path
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// establish the connection to the database via the import 
// turn on connection to db and server
// sync" part means that this is Sequelize taking the models and 
// connecting them to associated database tables
// force: false prevents the drop and re-create of the database tables at start-up
// force: true makes the database connection sync with the model definitions and associations
// and makes the tables re-create if there are any association changes
sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});