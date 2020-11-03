// This file will contain all of the user-facing routes, such as the homepage and login page.
const sequelize = require('../config/connection');
const { Post, User, Vote, Comment } = require('../models');

const router = require('express').Router();

// routes need to be created to display information

// this route displays all of the posts
router.get('/', (req, res) => {
    // render the response and specify which template we want to use
    // In this case, we want to render the homepage.handlebars template 
    // (the .handlebars extension is implied)
    // Handlebars.js will automatically feed homepage.handlebars into the main.handlebars template, 
    // and respond with a complete HTML file.
    // res.render('homepage', {
    //     // take a post object and pass it to the homepage.handlebars template
    //     // each property on the object (id, post_url, title, etc) becomes available
    //     // in the template using the handlebars {{}} syntax
    //     id: 1,
    //     post_url: 'https://handlebarsjs.com/guide/',
    //     title: 'Handlebars Docs',
    //     created_at: new Date(),
    //     vote_count: 10,
    //     comments: [{}, {}],
    //     user: {
    //         username: 'test_user'
    //     }
    // });

    // show the session variables
    console.log(req.session);

    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
          {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
    })
        .then(dbPostData => {
            // loop over and map each Sequelize object into a serialized version of itself, 
            // saving the results in a new posts array
            // rendering dbPostData would return the sequelize object with too much information
            // to serialize the object down to only the properties you need, you can use Sequelize's get() method
            // we didn't need to serialize data before when we built API routes, 
            // because the res.json() method automatically does that for you
            const posts = dbPostData.map(post => post.get({ plain: true }));
            // add new posts array into an object to be passed into the homepage template
            // the object allows us to add properties in the future
            res.render('homepage', { posts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// route to display log-in
router.get('/login', (req, res) => {
    // check for a session and redirect to the homepage if one exists
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    // log in page doesn't need any variables so we don't need to pass in a second argument
    res.render('login');
});

module.exports = router;