// ============================================================
// MONGODB + MONGOOSE
// ============================================================


// ------------------------------------------------------------
// 1. MongoDB vs Mongoose
// ------------------------------------------------------------

// MongoDB = the actual database.

// MongoDB is a NoSQL document database.
// It stores data in the form of BSON documents.

// Mongoose = an ODM (Object Document Mapper) for Node.js + MongoDB.

// Mongoose sits between our Node.js application and MongoDB:
//
//      Node.js Application
//              ↓
//           Mongoose
//              ↓
//           MongoDB
//
// Mongoose provides:
// - Schemas
// - Models
// - Validation
// - Type casting
// - Middleware / hooks
// - Query helpers
// - Easier interaction with MongoDB


import mongoose from 'mongoose';


// ------------------------------------------------------------
// 2. How MongoDB is structured
// ------------------------------------------------------------

// MongoDB:
//
// Database
//    ↓
// Collection
//    ↓
// Document
//    ↓
// Fields
//
// Example:
//
// Database: myApp
//      ↓
// Collection: users
//      ↓
// Document:
// {
//     name: "Aryan",
//     age: 20,
//     email: "aryan@example.com"
// }


// ------------------------------------------------------------
// 3. SQL vs MongoDB terminology
// ------------------------------------------------------------

// SQL:
//
// Database
//    ↓
// Table
//    ↓
// Row
//    ↓
// Columns
//
// MongoDB:
//
// Database
//    ↓
// Collection
//    ↓
// Document
//    ↓
// Fields
//
// Rough comparison:
//
// SQL                  MongoDB
// ---------------------------------
// Database          →  Database
// Table             →  Collection
// Row               →  Document
// Column            →  Field
//
// NOTE:
// These are conceptual equivalents, NOT exact equivalents.
// MongoDB is document-oriented, while SQL databases are
// relational.


/*
SQL table:

users

id | name  | age
---|-------|----
1  | Aryan | 20
2  | Rahul | 21


MongoDB collection:

users

{
    _id: 1,
    name: "Aryan",
    age: 20
}

{
    _id: 2,
    name: "Rahul",
    age: 21
}
*/


// ------------------------------------------------------------
// 4. Document
// ------------------------------------------------------------

// A MongoDB document is roughly similar to a row in SQL.
//
// But unlike a SQL row, a MongoDB document can contain:
// - Nested objects
// - Arrays
// - Different fields
// - Complex structures

// ------------------------------------------------------------
// 5. BSON
// ------------------------------------------------------------

// MongoDB stores documents internally as BSON.
//
// BSON = Binary JSON.
//
// BSON is similar to JSON but is a binary representation and
// supports additional data types that normal JSON does not
// natively represent, such as:
//
// - ObjectId
// - Date
// - Binary data
// - Decimal128
// - etc.
//
// Example MongoDB document:
//
// {
//     _id: ObjectId("..."),
//     name: "Aryan",
//     createdAt: Date(...)
// }
//
// JSON is mainly a data interchange format.
// BSON is the format MongoDB uses for storing and transmitting
// documents.


/* ------------------------------------------------------------
   6. MongoDB is schema-flexible
   ------------------------------------------------------------ */

// MongoDB itself does NOT require every document in a collection
// to have exactly the same structure.
//
// Example:
//
// Document 1:
//
// {
//     name: "Aryan",
//     age: 20
// }
//
// Document 2:
//
// {
//     name: "Rahul",
//     age: 21,
//     city: "Delhi"
// }
//
// Both can exist inside the same collection.
//
// This is one reason MongoDB is called schema-flexible.
//
// Mongoose, however, allows us to define a schema at the
// application level so that our data follows expected rules.


// ------------------------------------------------------------
// 7. Creating a Mongoose Schema
// ------------------------------------------------------------

// A Schema defines the structure and rules that Mongoose
// expects our documents to follow.
//
// IMPORTANT:
// A Mongoose Schema is NOT the same thing as a native MongoDB
// schema.
//
// MongoDB itself is schema-flexible.
// Mongoose provides schema enforcement/validation at the
// application layer.

// you can define schema in two ways 
// 1. field directly with value type or we can use field and object 
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        isActive: Boolean
    },
    {
        timestamps: true
    }
);


// ------------------------------------------------------------
// 8. Creating a Model
// ------------------------------------------------------------

// A Model is created from a Schema.
//
// The Model is the main interface our Node.js application uses
// to interact with MongoDB documents.


export const User = mongoose.model("User", userSchema);


// Think:
//
// Schema
//   ↓
// Model
//   ↓
// MongoDB Collection
//
// The model provides methods such as:
//
// User.create()
// User.find()
// User.findById()
// User.findOne()
// User.updateOne()
// User.deleteOne()
// etc.


// ------------------------------------------------------------
// 9. Model name → Collection name
// ------------------------------------------------------------

// We created:
//
// mongoose.model("User", userSchema)
//
// Mongoose normally converts the model name "User" into the
// collection name "users" by pluralizing it.
//
// Therefore:
//
// Model:
// User
//
// Collection:
// users
//
// So conceptually:
//
// userSchema
//      ↓
// User Model
//      ↓
// users Collection
//      ↓
// Documents
