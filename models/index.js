const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');
// create associations
// a user can have many posts
// creates the reference for the id column in the User model 
// to link to the corresponding foreign key pair, 
// which is the user_id in the Post model.
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// make the reverse association for the Posts back to the User
// in this case, a Post can only have a single User
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

// associate User and Post to one another through the Vote model
// this is a many-to-many relationship
// allowing both the User and Post models to query each other's information in the context of a vote
// see a total of how many votes a user creates
// and when we query a User, we can see all of the posts they've voted on. 
User.belongsToMany(Post, {
    through: Vote,
    // stipulate that the name of the Vote model should be displayed as voted_posts when queried on, making it a little more informative.
    as: 'voted_posts',
    // state what we want the foreign key to be in Vote
    foreignKey: 'user_id'
});
  
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// connecting Vote to User
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

// see the total number of votes on a post
// need to connect Vote to Post
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});
  
User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

// associations between comment and users/posts
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment };