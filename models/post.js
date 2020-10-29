// import the elements to build the Post model
// includes connection to MySQL
// and Model and Datatypes we'll use from the sequelize package

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model {}

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