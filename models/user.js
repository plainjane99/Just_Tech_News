// import the Model class and DataTypes object from Sequelize
// the Model class is what we create our models from 
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our User model from the Sequelize constructor
// So the class inherits the Model functionality
class User extends Model {}

// initialize the model's data and configuration, passing in two objects as arguments
// define table columns and configuration
// the .init method provides context as to how those inherited methods should work
User.init(
    // The first object will define the columns and data types for those columns
    {
        // define an id column
        id: {
            // use the special Sequelize DataTypes object to define what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
            // TABLE COLUMN DEFINITIONS GO HERE
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // this is a built-in validator in sequelize
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    // The second object configures certain options for the table.
    {
        // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

// export the newly created model so we can use it in other parts of the app
module.exports = User;