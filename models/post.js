// import the elements to build the Post model
// includes connection to MySQL
// and Model and Datatypes we'll use from the sequelize package

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model {
    // use sequelize's model methods to replace busy code by writing our own custom method
    // javascript built-in static keyword to indicate that 
    // the upvote method is one that's based on the Post model 
    // and not an instance method like we used earlier with the User model.
    // i.e. set it up so that we can now execute Post.upvote() 
    // as if it were one of Sequelize's other built-in methods
    // passes in req.body and the models object
    static upvote(body, models) {
        // using models.Vote 
        // and we'll pass the Vote model in as an argument from post-routes.js.
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [
                    sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                    'vote_count'
                    ]
                ]
            });
        });
    }
}

// create fields/columns for Post model
// configure the naming conventions, 
// pass the current connection instance to initialize the Post model
// define the post schema
Post.init(
    {
        // identify id as primary key and set auto-increment
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // set title to be string and required
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // set as string
        // offer validation in the schema definition. 
        // ensure that url is a verified link by setting the isURL property to true.
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        // user handle
        // establish the relationship between this post and the user 
        // by creating a reference to the User model, 
        // specifically to the id column that is defined by the key property, 
        // which is the primary key. 
        // The user_id is conversely defined as the foreign key and will be the matching link.
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    // configure the metadata, including the naming conventions
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;