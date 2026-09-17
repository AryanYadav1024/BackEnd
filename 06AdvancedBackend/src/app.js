
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { LIMIT } from "./constants.js";


// Creates the Express application object.
// `app` is responsible for configuring our server,
// registering middleware, routes, error handlers, etc.
const app = express()


/*
    ============================
            MIDDLEWARE
    ============================

    `app.use()` is used to register middleware.

    Middleware sits in the request → response pipeline.

    Request
       ↓
    middleware 1
       ↓
    middleware 2
       ↓
    route handler
       ↓
    Response

    A middleware can:
    1. Modify the request/response
    2. Perform some operation
    3. End the request by sending a response
    4. Call `next()` to continue to the next middleware
*/


// ============================
// CORS MIDDLEWARE
// ============================

app.use(cors({

    // Specifies which frontend origin is allowed
    // to make cross-origin requests to our backend.
    //
    // Example:
    // CORS_ORIGIN=http://localhost:5173
    //
    // This is mainly important when frontend and backend
    // are running on different origins.
    origin: process.env.CORS_ORIGIN,


    // Allows credentials such as cookies to be included
    // in cross-origin requests.
    //
    // This is commonly needed when authentication
    // uses cookies.
    credentials: true

}))


// ============================
// JSON BODY PARSER
// ============================

app.use(express.json({

    // Limits the maximum size of a JSON request body.
    //
    // This prevents clients from sending unnecessarily
    // huge JSON payloads and consuming excessive memory
    // and CPU while the server parses them.
    limit: LIMIT

}))

/*
    `express.json()` parses requests whose body contains JSON.

    Example request:

    POST /users

    Content-Type: application/json

    {
        "name": "Aryan",
        "age": 20
    }

    Without the JSON parser, Express does not automatically
    give us the parsed object in `req.body`.

    With this middleware:

    Raw HTTP body
          ↓
    JSON parser
          ↓
    JavaScript object
          ↓
    req.body
*/


// ============================
// URL-ENCODED BODY PARSER
// ============================

app.use(express.urlencoded({

    /*
        Allows parsing of URL-encoded request bodies.

        Example:

        username=aryan&age=20

        This format is commonly produced by
        traditional HTML forms.
    */
    extended: true,


    // Maximum allowed size of the URL-encoded body.
    limit: LIMIT

}))

/*
    `extended: true` allows richer/nested objects
    to be represented in URL-encoded data.

    Example:

    user[name]=Aryan
    user[age]=20

    can be parsed into something conceptually like:

    {
        user: {
            name: "Aryan",
            age: "20"
        }
    }
*/


// ============================
// STATIC FILE MIDDLEWARE
// ============================

app.use(express.static("public"))

/*
    Makes the `public` directory available for
    serving static files.

    Example project:

    project/
    ├── public/
    │   ├── logo.png
    │   ├── index.html
    │   └── style.css
    └── server.js


    Request:

    GET /logo.png

    Express looks for:

    public/logo.png

    If the file exists:
        → Express sends the file.

    If it doesn't:
        → middleware passes control to the next layer.

    This is another example of why `app.use()`
    is used: static file serving is middleware.
*/


// ============================
// COOKIE PARSER
// ============================

app.use(cookieParser())

/*
    HTTP cookies arrive through the Cookie header.

    Example:

    Cookie: accessToken=abc123; theme=dark

    `cookieParser()` parses that header and makes
    the cookies conveniently available through:

    req.cookies

    Example:

    req.cookies

    {
        accessToken: "abc123",
        theme: "dark"
    }

    This is especially useful for authentication
    when access/refresh tokens are stored in cookies.
*/


// Export the configured Express application
// so that another file can import it and start
// the server / attach routes.

export default app