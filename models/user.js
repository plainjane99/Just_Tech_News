// import the Model class and DataTypes object from Sequelize
// the Model class is what we create our models from 
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// node package to perform hashing function
const bcrypt = require('bcrypt');

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
        // Hashing performs a one-way transformation on a password, 
        // turning the password into another string, called the hashed password
        // use an async function that will return a hashed password in a Promise
        // bcrypt is CPU intensive so we need to allow other functions to run
        // this method will autogenerate a salt
        // saltRounds parameter is known as the cost factor and 
        // controls how many rounds of hashing are done by the bcrypt algorithm
        // special sequelize functions called hooks (or lifecycle events) that 
        // are called before or after calls in sequelize
        // pass in hooks object into the second part of the user.init()
        // hooks: {
        //     // set up beforeCreate lifecycle "hook" functionality
        //     // we need a hook that will fire just before a new instance of user is created
        //     beforeCreate(userData) {
        //         // bcrypt.hash(myPlaintextPassword, saltRounds)
        //         // execute the bcrypt hash function on the   
        //         // userData object that contains the plaintext password
        //         // in the password property
        //         // salt value of 10
        //         // resulting hashed password is then passed to the Promise object as newUserData
        //         return bcrypt.hash(userData.password, 10).then(newUserData => {
        //             // the hashed password is returned 
        //             return newUserData
        //         });
        //     }
        // },

        // alternate way to handle async functions that will make the code more concise and legible
        // keyword pair async/await works in tandem
        // async keyword is used as a prefix to the function that contains the asynchronous function. 
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                // await can be used to prefix the async function, 
                // which will then gracefully assign the value from the response to the newUserData's password property. 
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                // The newUserData is then returned to the application with the hashed password.
                return newUserData;
            },
            // set up beforeUpdate lifecycle "hook" functionality prior to an update
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }        
        },

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