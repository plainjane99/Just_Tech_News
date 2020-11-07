// this file will serve as a means to collect all of the API routes and package them up for us

const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');
const { route } = require('./comment-routes');

// implement 'users' routes to another router instance, 
// prefixing them with the path /users 
router.use('/users', userRoutes);
// exposed with the correct URL path
router.use('/posts', postRoutes);
// prefix all routes in comment-routes.js with /comments prefix
router.use('/comments', commentRoutes);

module.exports = router;