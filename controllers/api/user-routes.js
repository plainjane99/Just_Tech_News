const router = require('express').Router();
// destructure User, Post and Vote from the imported models
const { User, Post, Vote, Comment } = require('../../models');
// import the authguard function
const withAuth = require('../../utils/auth');

// GET /api/users (all users)
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method
    // .findAll() is one of Model class's methods which lets us query all items from the User table
    // this is the equivalent of SELECT * FROM users
    // sequelize is promise-based so we get to use .then()
    User.findAll({
        // provide an attributes key to instruct the query to exclude the password column
        attributes: { exclude: ['password'] }
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    ;
});

// GET /api/users/1 (one user)
router.get('/:id', (req, res) => {
    // sequalize method to pull one item
    User.findOne({
        // where option indicates what parameter to bring back
        where: {
            id: req.params.id
        },
        // exclude password
        attributes: { exclude: ['password'] },
        include: [
            // include Post model to
            // receive the title information of every post they've ever voted on
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            // contextualize it by going through the Vote table
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
        .then(dbUserData => {
            // if the search brings back nothing
            if (!dbUserData) {
                // send a 404 status to indicate everything is ok but no data found
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            // otherwise, send back the data
            res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        })
    ;
});

// POST /api/users
router.post('/', withAuth, (req, res) => {
    // we use sequelize's create method to insert data
    // pass in key/value pairs where the keys are what we defined in the User model
    // and the values are what we get from req.body
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => {
            // gives our server easy access to user's user_id, username, and a boolean of whether user is logged in
            // We want to make sure the session is created before we send the response back, 
            // so we're wrapping the variables in a callback. 
            // The req.session.save() method will initiate the creation of the session and 
            // then run the callback function once complete
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;
            
                res.json(dbUserData);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    ;
});

// a login route could have used the GET method 
// but there is a reason why a POST is the standard for the login in process
// A GET method carries the request parameter appended in the URL string, 
// whereas a POST method carries the request parameter in req.body, 
// which makes it a more secure way of transferring data from the client to the server. 
// Remember, the password is still in plaintext, 
// which makes this transmission process a vulnerable link in the chain.
router.post('/login', (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    // query the user table using the findOne() method
    User.findOne({
        // query by email entered and assign to req.body.email
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        // if user email is not found
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }

        // if user email is found, verify the user's identity by matching the password
        // from the user and the hashed password in the database.
        // this will be done in the promise of the query
        // res.json({ user: dbUserData });

        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);

        // if the match returns a false value, send back error message and exit 
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            // if there is a match, send message of log in
            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });   
});

// PUT /api/users/1
router.put('/:id', withAuth, (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // we use sequelize's update method to combine the parameters for creating data and looking up data
    // we pass in req.body to provide new data we want to use in the update
    User.update(req.body, {
        individualHooks: true,
        where: {
            // req.params.id to indicate where exactly we want that new data to be used
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    ;
});

// DELETE /api/users/1
router.delete('/:id', withAuth, (req, res) => {
    // sequelize's destory method deletes data
    User.destroy({
        // identifies where we want to delete data from
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
          }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// log out route
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            // send back 204 status after the session has successfully been destroyed
            res.status(204).end();
        });
    }
        else {
        res.status(404).end();
    }
});

module.exports = router;