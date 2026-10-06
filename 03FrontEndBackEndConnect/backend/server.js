import express from 'express'

import 'dotenv/config'
const app = express()
const port = process.env.PORT

app.get('/',(req,res)=>{
    res.send('Server is ready')
})

// so we have two methods to serve the frontend to the users/clients
// one is frontend is running of different server and that is provided to user 
// or backend itself provide the frontend by using middlware app.use(express.static('dist'))

// sometimes what people do is create a build for react project and they serve it directly to the backend deployment
// how they create a build(production distribution) then place it in backend deployment and express server the static frontend to browser itself
// app.use(express.static('dist'))
// dist also contains -> react runtime 
// this helps solve server cost of running frontend differently 

// get a list of 5 jokes
// backend api endpoint frontend can do fetch or api request on this path 
// then we will send response accordingly 
// CORS - cross origin resource sharing - if url or port are different it is considered cross origin
// no we would have to allow the req from the frontend based on the url
// so we setup proxy in react app or we can use cors
// we setup proxy in vite.config.js and setup server object which has proxy object mapped to keys 
// like /api mapped to the server endpoint react app will append proxy in front whereever /api is written in our react project

// standardization to use api
app.get('/api/jokes',(req,res)=>{
    const jokes = [
        {
            id: 1,
            title: 'Joke 1',
            content: 'This is joke 1'
        },
        {
            id: 2,
            title: 'Joke 2',
            content: 'This is joke 2'
        },
        {
            id: 3,
            title: 'Joke 3',
            content: 'This is joke 3'
        },
        {
            id: 4,
            title: 'Joke 4',
            content: 'This is joke 4'
        },
        {
            id: 5,
            title: 'Joke 5',
            content: 'This is joke 5'
        }
    ]
    res.send(jokes)
})

app.get('/api/darkJokes',(req,res)=>{
    const darkJokes = [
        {
            id: 1,
            title: 'DarkJoke 1',
            content: 'This is DarkJoke 1'
        },
        {
            id: 2,
            title: 'DarkJoke 2',
            content: 'This is DarkJoke 2'
        },
        {
            id: 3,
            title: 'DarkJoke 3',
            content: 'This is DarkJoke 3'
        },
        {
            id: 4,
            title: 'DarkJoke 4',
            content: 'This is DarkJoke 4'
        },
        {
            id: 5,
            title: 'DarkJoke 5',
            content: 'This is DarkJoke 5'
        }
    ]
    res.send(darkJokes)
})

app.listen(port,()=>{
    console.log(`App Listening on port ${port}`);
})

