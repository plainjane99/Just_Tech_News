const express = require('express');
// the files at this path collects everything for us to use in server.js
const routes = require('./controllers');
// importing the connection to Sequelize from noted path
const sequelize = require('./config/connection');
// The path module provides utilities for working with file and directory paths
const path = require('path');
// set up handebars.js
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;
// sets up handlebars
const hbs = exphbs.create({});

// sets up handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// The express.static() method is a built-in Express.js middleware function 
// that can take all of the contents of a folder and serve them as static assets. 
// This is useful for front-end specific files like images, style sheets, and JavaScript files.
app.use(express.static(path.join(__dirname, 'public')));

// this needs to be below all of the express statements
// turn on routes
app.use(routes);

// establish the connection to the database via the import 
// turn on connection to db and server
// sync" part means that this is Sequelize taking the models and 
// connecting them to associated database tables
// force: false prevents the drop and re-create of the database tables at start-up
// force: true makes the database connection sync with the model definitions and associations
// and makes the tables re-create if there are any association changes
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});