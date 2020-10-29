// include packages and models that we'll need to create the Express.js API endpoints
const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connection');

// create a route that will retrieve all posts in the database
// get all users
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
        // Query configuration
        // requesting these attributes
        attributes: ['id', 'post_url', 'title', 'created_at',
                    [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
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
        attributes: ['id', 'post_url', 'title', 'created_at',
                    [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
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

// PUT /api/posts/upvote
// the vote is theoretically a part of the Post's data
// so we will update the data
// defined before the :id route because ???
// involve two queries: 
// first, using the Vote model to create a vote, 
// second, querying on that post to get an updated vote count
// router.put('/upvote', (req, res) => {
//     // pass in both the user's id and the post's id with req.body
//     Vote.create({
//         user_id: req.body.user_id,
//         post_id: req.body.post_id
//     }).then(() => {
//         // then find the post we just voted on
//         return Post.findOne({
//             where: {
//                 id: req.body.post_id
//             },
//             attributes: [
//                 'id',
//                 'post_url',
//                 'title',
//                 'created_at',
//                 // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
//                 [
//                     sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
//                     'vote_count'
//                 ]
//             ]
//         })
//             .then(dbPostData => res.json(dbPostData))
//             .catch(err => {
//                 console.log(err);
//                 res.status(400).json(err);
//             })
//         ;
//     })
// });
// use sequelize's model methods to replace busy code (see above)
router.put('/upvote', (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, { Vote })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    ;
});

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