const router = require('express').Router();
const { User } = require('../../models');

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
        // exclude password
        attributes: { exclude: ['password'] },
        // where option indicates what parameter to bring back
        where: {
          id: req.params.id
        }
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
router.post('/', (req, res) => {
    // we use sequelize's create method to insert data
    // pass in key/value pairs where the keys are what we defined in the User model
    // and the values are what we get from req.body
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    ;
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // we use sequelize's update method to combine the parameters for creating data and looking up data
    // we pass in req.body to provide new data we want to use in the update
    User.update(req.body, {
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
router.delete('/:id', (req, res) => {
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

module.exports = router;