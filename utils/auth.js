// stop a user from accessing the dashboard without being logged in
// ie from directly typing in the path to a url
// good approach would be to redirect a user to the login route
// by implementing custom middleware using express.js
// At a high-level, middleware is just a function that executes before the function 
// that sends the response back
// our own middleware function that can authguard routes
const withAuth = (req, res, next) => {
    // check for the existence of a session property
    if (!req.session.user_id) {
        // use res.redirect if session is not there
        res.redirect('/login');
    // if session does exist
    } else {
        // next calls the next middleware function, passing along the same req and res values
        next();
    }
};

module.exports = withAuth;