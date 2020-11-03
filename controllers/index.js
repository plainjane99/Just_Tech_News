// this file collects the packaged group of API endpoints 

const router = require('express').Router();

const apiRoutes = require('./api');

const homeRoutes = require('./home-routes.js');

// prefixes api endpoints with the path /api
router.use('/api', apiRoutes);
// prefix for homeroutes
router.use('/', homeRoutes);

// if we make a request to any endpoint that doesn't exist, 
// we'll receive a 404 error indicating we have requested an incorrect resource, 
// another RESTful API practice
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;