// include packages and models that we'll need to create the Express.js API endpoints
const router = require('express').Router();
const { Post, User } = require('../../models');

// create a route that will retrieve all posts in the database
// get all users
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
        // Query configuration
        // requesting these attributes
        attributes: ['id', 'post_url', 'title', 'created_at'],
        // return the posts in descending order by the 'created_at' property
        order: [['created_at', 'DESC']], 
        // including username which requires a reference to the User model
        // an array of objects
        // defined by reference to the model and attributes
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        // create a Promise that captures the response from the database call
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    ;
  
});

// single user query
router.get('/:id', (req, res) => {
    Post.findOne({
        // using req.params to retrieve the id property from the route
        where: {
            id: req.params.id
        },
        // requesting these attributes
        attributes: ['id', 'post_url', 'title', 'created_at'],
        // including username which requires a reference to the User model
        include: [
            {
            model: User,
            attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    ;
});

// create a post
router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
        // use req.body to populate the columns in the post table
        // assign these values to the req.body object that was in the request from the user
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    })
;

// update an existing entry
// first retrieve the post instance by id then alter the value of the title
router.put('/:id', (req, res) => {
    Post.update(
        {
            // use req.body.title value to replace the title of the post
            title: req.body.title
        },
        {
            // use the request parameter to find the post
            where: {
                // req.params.id to indicate where exactly we want that new data to be used
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            // send back data that has been modified and stored in database
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    ;

});

// delete a post
router.delete('/:id', (req, res) => {
    Post.destroy({
        // find using unique id in the query parameter
        where: {
            id: req.params.id
        }
    })
      .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            // return the resulting
            res.json(dbPostData);
            console.log(dbPostData);
      })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    ;
});

module.exports = router;