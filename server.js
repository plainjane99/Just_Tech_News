const express = require('express');
// the files at this path collects everything for us to use in server.js
const routes = require('./controllers');
// importing the connection to Sequelize from noted path
const sequelize = require('./config/connection');
// The path module provides utilities for working with file and directory paths
const path = require('path');
// set up handebars.js
const exphbs = require('express-handlebars');
// express-session and connect-session-sequelize creates sessions
// that allow our express.js server to keep track of which user is making a request
// and store useful data about them in memory
// library allows us to connect to the back end
const session = require('express-session');
// library automatically stores the sessions created by express-session into our database.
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// import helpers
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;
// sets up handlebars
// pass helpers through
const hbs = exphbs.create({ helpers });
// set us sessions and connects the session to our Sequelize database
const sess = {
    // secret property holds secret data and stored in .env file
    secret: 'Super secret secret',
    // {} tells our session to use cookies
    // options would be added to the cookie object
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

// sets up handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// The express.static() method is a built-in Express.js middleware function 
// that can take all of the contents of a folder and serve them as static assets. 
// This is useful for front-end specific files like images, style sheets, and JavaScript files.
app.use(express.static(path.join(__dirname, 'public')));
// set up sessions
app.use(session(sess));

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