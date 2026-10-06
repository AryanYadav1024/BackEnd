/*
    WHAT IS EXPRESS?

    Express is a minimal, flexible web framework built on top of Node.js.

    Node.js can create an HTTP server using its built-in `http` module,
    but managing the server, routing, middleware, requests, responses, etc.
    directly can become harder.

    That is why we have Express as an additional layer of abstraction
    which provides an easier way to manage HTTP servers and web applications.
*/

require('dotenv').config()
const express = require("express");

// What does this do?
// This tells Node.js to find the `express` package,
// load it, and import whatever it exports.
//
// We could also use:
// import express from "express";
//
// When Node.js sees:
// require("express")
//
// Node.js performs module resolution to find the Express package,
// loads the module, and returns what that module exports.



const app = express();

/*
    Now what we are doing is calling the `express` function.

    What does it do?

    It creates and returns an Express application object.

    That application object is stored inside `app`.

    The Express application object provides methods such as:

        app.get()
        app.post()
        app.put()
        app.delete()
        app.use()
        app.listen()

    These methods are available through the JavaScript object/prototype
    behavior of the Express application and Express's internal implementation.

    `app` is the object through which we configure our Express application.
*/


/*
    ROUTES

    '/x' is a route/path.

    '/' is the root path, commonly thought of as the home route.

    When a request comes from our frontend, we tell Express:

        "If the request matches this HTTP method and this path,
         execute this route handler."

    For example:

        GET /

    means:

        HTTP method = GET
        path        = /

    We can then fetch data from a database or perform some other
    business logic and send the result back to the frontend
    as an HTTP response.


    We can define multiple routes.

    Express keeps track of these route definitions and their
    route handlers.

    This is an api endpoint the api is the broader concept like we define 
    backend api which contains multiple api endpoints
    Conceptually:

        GET /
          ↓
        route handler
          ↓
        (req, res) => {
            res.send("Hello World!");
        }
*/


/*
    ROUTE HANDLER

    A route handler is simply a JavaScript callback function
    that Express executes when an incoming request matches
    the registered HTTP method and path.

    Example:

        app.get("/", (req, res) => {
            res.send("Hello World!");
        });

    The function:

        (req, res) => {
            res.send("Hello World!");
        }

    is the route handler.
*/


/*
    `req` = request
    `res` = response

    Express gives these objects to our route handler.

    --------------------------------------------------
    req = Request object
    --------------------------------------------------

    `req` contains information about what the client sent
    to our server.

    Examples:

        req.params
        req.query
        req.body
        req.headers
        req.method
        req.url


    --------------------------------------------------
    res = Response object
    --------------------------------------------------

    `res` allows our server to send a response back
    to the client.

    Example:

        res.json({
            name: "Aryan"
        });

    Or:

        res.status(404).send("Not Found");
*/


const port = process.env.PORT; 
// require('dotenv').config() this is what we have to write at the top 
// to import dotenv package 
// now some information need to stay sensitive so we have another package called dotenv
// in this we define our sensitive data which belongs to the environment not the application
// and we send this over a private channel

// `3000` is the port on which our backend will listen.
//
// We can technically choose another available port,
// but 3000 is a commonly used development port.
//
// For example, a React development server commonly uses:
// 5173
//
// So during development we might have:
//
// React frontend  -> localhost:5173
// Express backend -> localhost:3000



app.get("/", (req, res) => {

    // This is the route handler.
    // If an HTTP GET request arrives for `/`,
    // Express executes this function.

    res.send('<h1>Hello World!</h1>')

});

app.get('/aryan', (req, res) => {
    res.send(`<!DOCTYPE html>
        <html>
        <head>
            <title>Aryan Page</title>
        </head>

        <body>
            <h1>Hello Aryan</h1>
            <p>This HTML came from the Express backend.</p>
            <button>Click Me</button>
        </body>

        </html>`)
});

app.get('/meow',(req,res)=>{
    res.status(501).send("server not working meow")
})


/*
    APP.LISTEN()

    This is where our application starts listening
    for incoming network connections.

    `app.listen(port)` uses the underlying Node.js HTTP
    server machinery.

    Conceptually, Express does something similar to:

        const server = http.createServer(app);
        server.listen(port);


    So the relationship is:

        Express application (`app`)
                    ↓
        Node.js HTTP server
                    ↓
        TCP listening socket
                    ↓
        Operating System
                    ↓
        IP address + Port


    The port is used along with the IP address so that a client
    can establish a network connection to the correct server.

    Example:

        localhost:3000
        127.0.0.1:3000

    Here:

        127.0.0.1 -> IP address
        3000      -> Port


    The listening socket is created/bound by the OS for the
    server to listen for incoming TCP connections.

    When a client connects, the OS provides a separate
    connected socket for that particular connection.

    Conceptually:

                    Port 3000
                        ↓
                TCP listening socket
                        ↓
              ┌─────────┼─────────┐
              ↓         ↓         ↓
          Client A   Client B   Client C
          connection connection connection


    The listening socket waits for incoming connections.

    The connected socket is then used for communication
    with that particular client.


    IMPORTANT:

    The PORT gets the network connection to the correct
    listening socket.

    The HTTP METHOD + PATH determine which Express route
    handler should handle the request.


    For example:

        http://localhost:3000/users
                    │          │
                    │          └── Express route/path
                    │              `/users`
                    │
                    └── Network destination
                        IP/hostname + port
*/


app.listen(port, () => {

    console.log(`App listening on port ${port}`);

});