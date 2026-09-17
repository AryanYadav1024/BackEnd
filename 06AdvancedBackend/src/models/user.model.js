
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/*
========================================================
1. WATCH HISTORY SUB-SCHEMA
========================================================

We create a small schema for each item in watchHistory.

A user can have:

watchHistory: [
    { video: ObjectId(...) },
    { video: ObjectId(...) },
    { video: ObjectId(...) }
]

ObjectId = MongoDB's unique ID type.

ref: "Video"
    ↓
Tells Mongoose that this ObjectId refers to
a document from the Video model.

This can later be used with:

.populate("watchHistory.video")
*/

const watch = new mongoose.Schema({

    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }

});


/*
========================================================
2. USER SCHEMA
========================================================

Schema = defines the structure/rules of a User document.

Mongoose uses this schema to:
- validate data
- apply transformations
- create indexes
- run middleware/hooks
*/

const userSchema = new mongoose.Schema({

    username: {

        type: String,

        // User must provide a username
        required: true,

        // Convert "Aryan" → "aryan"
        lowercase: true,

        // Create an index for faster queries
        index: true,

        // Remove unnecessary spaces
        trim: true
    },


    email: {

        type: String,

        required: true,

        // MongoDB should not allow duplicate emails
        unique: true,

        // "ARYAN@GMAIL.COM" → "aryan@gmail.com"
        lowercase: true,

        trim: true
    },


    fullname: {

        type: String,

        required: true,

        index: true,

        trim: true
    },


    password: {

        type: String,

        required: [true, "Password is required"]

        /*
        IMPORTANT:

        We DO NOT want to store:

        password: "hello123"

        Instead, before saving, bcrypt will turn it into
        a password hash.

        Example:

        "hello123"
              ↓
        bcrypt.hash()
              ↓
        "$2b$10$......."
              ↓
        MongoDB

        The plaintext password is never stored.
        */
    },


    /*
    ====================================================
    WATCH HISTORY
    ====================================================

    This is an array of the "watch" sub-schema.

    Example:

    watchHistory: [
        {
            video: ObjectId("123...")
        },
        {
            video: ObjectId("456...")
        }
    ]
    */

    watchHistory: [
        watch
    ],


    /*
    ====================================================
    AVATAR
    ====================================================

    Usually we don't store the actual image inside MongoDB.

    The image can be uploaded to something like Cloudinary.

    MongoDB stores the URL:

    avatar:
    "https://cloudinary.com/...."

    Similar general idea to storing an object/file URL
    with services such as AWS S3.
    */

    avatar: {

        type: String,

        required: true
    },


    /*
    Optional cover image.

    If the user doesn't have one, this can be undefined.
    */

    coverImage: {

        type: String
    },


    /*
    ====================================================
    REFRESH TOKEN
    ====================================================

    Used as part of JWT authentication.

    Typically we have:

    Access Token
        ↓
    Short-lived
    Example: 15 minutes

    Refresh Token
        ↓
    Longer-lived
    Example: days/weeks

    When the access token expires, the refresh token
    can be used to obtain a new access token.
    */

    refreshToken: {

        type: String
    }

},
{
    /*
    Mongoose automatically adds:

    createdAt
    updatedAt

    to every User document.
    */

    timestamps: true
});


/*
========================================================
3. BCRYPT + PRE("SAVE") MIDDLEWARE
========================================================

pre("save") means:

"Run this function BEFORE Mongoose saves the
document to MongoDB."

Flow:

User.create()
      ↓
Mongoose creates document
      ↓
pre("save")
      ↓
bcrypt hashes password
      ↓
MongoDB saves document
*/


userSchema.pre("save", async function(next) {

    /*
    "this" refers to the current User document.

    Example:

    this.password
        ↓
    "hello123"

    before hashing.
    */


    /*
    IMPORTANT:

    Don't hash the password every time the user saves.

    Suppose:

    First save:
        hello123
           ↓
        bcrypt
           ↓
        hash123

    Later the user changes only their name.

    If we hash again:

        hash123
           ↓
        bcrypt
           ↓
        hash456

    Now we're hashing an already-hashed password.

    So we check whether password was actually modified.
    */

    if (!this.isModified("password")) {

        // Password didn't change.
        // Continue with the normal save operation.

        return next();
    }


    /*
    bcrypt.hash()

    Takes:

    1. Plain password
    2. Salt/work factor

    Example:

    "hello123"
         ↓
    bcrypt.hash("hello123", 10)
         ↓
    "$2b$10$..........."
    */

    this.password = await bcrypt.hash(
        this.password,
        10
    );


    /*
    next()

    Tells Mongoose:

"Middleware is finished.
Continue with the save operation."

    So the flow becomes:

    pre("save")
        ↓
    password hashed
        ↓
    next()
        ↓
    MongoDB INSERT/UPDATE
    */

    next();
});


/*
========================================================
4. JWT METHODS
========================================================

JWT is NOT used for hashing passwords.

bcrypt and JWT solve different problems.

bcrypt:
    Password security

JWT:
    Authentication/session mechanism


bcrypt:

    Password
       ↓
    bcrypt.hash()
       ↓
    Stored hash


Login:

    Entered password
       ↓
    bcrypt.compare()
       ↓
    true / false


JWT:

    Login successful
       ↓
    jwt.sign()
       ↓
    JWT token
       ↓
    Client sends token with future requests
       ↓
    jwt.verify()
       ↓
    Server knows which user is making request
*/


/*
We haven't added the JWT methods yet.

They are commonly added to the schema like:

userSchema.methods.generateAccessToken = function() {

    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};


Notice:

bcrypt → password

jwt.sign() → creates authentication token

They are NOT doing the same job.
*/


/*
========================================================
5. CREATE THE USER MODEL
========================================================

Schema:
    Defines the structure/rules.

Model:
    Gives us methods to interact with MongoDB.

mongoose.model("User", userSchema)

creates the User model.

We can then do things like:

User.create(...)
User.find(...)
User.findOne(...)
User.findById(...)
User.findByIdAndUpdate(...)

Conceptually:

Schema
   ↓
Model
   ↓
MongoDB collection
*/


export const User = mongoose.model(
    "User",
    userSchema
);