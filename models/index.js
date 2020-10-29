const User = require('./User');
const Post = require('./Post');

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

module.exports = { User, Post };