// this file will serve as a means to collect all of the API routes and package them up for us

const router = require('express').Router();

const userRoutes = require('./user-routes.js');

// implement 'users' routes to another router instance, 
// prefixing them with the path /users 
router.use('/users', userRoutes);

module.exports = router;