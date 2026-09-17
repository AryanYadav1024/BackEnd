
// ============================================================
// DATABASE CONNECTION
// ============================================================
// This file is responsible for connecting our Node.js backend
// application to MongoDB.
//
// Flow:
//
// Node.js application
//        ↓
//     Mongoose
//        ↓
// MongoDB Node.js Driver
//        ↓
//    MongoDB Server
//
// We keep database connection logic separate from index.js
// so that each file has a clear responsibility.
// ============================================================


// ------------------------------------------------------------
// 1. IMPORT MONGOOSE
// ------------------------------------------------------------

import mongoose from 'mongoose'

// Mongoose is an ODM (Object Data Modeling) library for MongoDB.
//
// It provides:
// - Schema definitions
// - Models
// - Validation
// - Middleware/hooks
// - Convenient database queries
//
// Under the hood:
// Mongoose → MongoDB Node.js Driver → MongoDB
//
// Example later:
// const User = mongoose.model("User", userSchema)
// User.find()
// User.create()
// User.findById()


// ------------------------------------------------------------
// 2. IMPORT DATABASE NAME
// ------------------------------------------------------------

import { DB_NAME } from '../constants.js'

// DB_NAME contains the name of the MongoDB database.
//
// Example:
//
// constants.js
// const DB_NAME = "waterwise"
//
// Then:
// DB_NAME === "waterwise"
//
// We keep this separately instead of hardcoding the database
// name here. This makes configuration easier to maintain.


// ------------------------------------------------------------
// 3. LOAD ENVIRONMENT VARIABLES
// ------------------------------------------------------------

import dotenv from 'dotenv'

dotenv.config()

// dotenv reads our .env file and loads its values into:
//
// process.env
//
// Example .env:
//
// MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
//
// After dotenv.config():
//
// process.env.MONGODB_URI
//
// gives us:
//
// mongodb+srv://username:password@cluster.mongodb.net
//
// IMPORTANT:
// We don't hardcode credentials directly into our source code.
//
// ❌ Bad:
// mongoose.connect("mongodb+srv://username:password@...")
//
// ✅ Better:
// mongoose.connect(process.env.MONGODB_URI)
//
// The .env file should normally be added to .gitignore.


// ------------------------------------------------------------
// 4. CREATE THE DATABASE CONNECTION FUNCTION
// ------------------------------------------------------------

const connectDB = async () => {

// async means this function performs asynchronous work.
//
// Connecting to MongoDB requires network communication.
// Network operations take time, so mongoose.connect()
// returns a Promise.
//
// Because this function is async, we can use await inside it.


    try {

        // ----------------------------------------------------
        // 5. CONNECT TO MONGODB
        // ----------------------------------------------------

        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        )

        // Let's understand this URI.
        //
        // Suppose:
        //
        // process.env.MONGODB_URI
        // =
        // mongodb+srv://username:password@cluster.mongodb.net
        //
        // DB_NAME
        // =
        // waterwise
        //
        // Then:
        //
        // `${process.env.MONGODB_URI}/${DB_NAME}`
        //
        // becomes:
        //
        // mongodb+srv://username:password@cluster.mongodb.net/waterwise
        //
        // mongoose.connect() uses this URI to establish a
        // connection with MongoDB.
        //
        // Under the hood, roughly:
        //
        // mongoose.connect()
        //        ↓
        // MongoDB Node.js Driver
        //        ↓
        // Network connection
        //        ↓
        // MongoDB server
        //        ↓
        // Authentication / handshake
        //        ↓
        // Connection established
        //
        //
        // WHY await?
        //
        // mongoose.connect() returns a Promise.
        //
        // Without await:
        //
        // mongoose.connect(uri)
        // console.log("Server started")
        //
        // The application could continue before we know whether
        // the database connection actually succeeded.
        //
        // With await:
        //
        // await mongoose.connect(uri)
        //
        // this async function waits until the connection attempt
        // succeeds or fails.
        //
        // IMPORTANT:
        // await does NOT freeze the entire Node.js process.
        // It only pauses execution of this async function while
        // the asynchronous operation is being completed.
        console.log(`MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {

        // ----------------------------------------------------
        // 6. HANDLE DATABASE CONNECTION FAILURE
        // ----------------------------------------------------

        console.error("Db connection failed", error)

        // If mongoose.connect() rejects its Promise,
        // the error is caught here.
        //
        // Possible reasons:
        //
        // - Wrong MongoDB URI
        // - Wrong username/password
        // - MongoDB server unavailable
        // - Network/DNS problem
        // - Access permissions
        // - Invalid configuration


        // ----------------------------------------------------
        // 7. TERMINATE THE NODE.JS PROCESS
        // ----------------------------------------------------

        process.exit(1)

        // process = the current Node.js process.
        //
        // process.exit(1) tells Node.js:
        //
        // "Terminate the application because something went wrong."
        //
        // Exit codes conventionally mean:
        //
        // 0     → successful termination
        // non-0 → error/failure
        //
        // Why terminate?
        //
        // Our backend depends on the database.
        // If the database connection fails, allowing the server
        // to continue accepting requests can leave us with an
        // application that is technically running but unable
        // to perform its core operations.
        //
        // In production, a process manager/container platform
        // can detect the failed process and restart it.


    }
}


// ------------------------------------------------------------
// 8. EXPORT THE FUNCTION
// ------------------------------------------------------------

// Your original comment says:
// "here we will create and export the function to connect to db"
//
// Therefore, the function needs to actually be exported.
//
// Default export:
// Other files can import it as:
//
// import connectDB from './db/index.js'
//
// Then:
//
// connectDB()

export default connectDB
