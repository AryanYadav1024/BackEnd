import { useState,useEffect } from "react"
import axios from 'axios'

function DarkJokes(){
  const [darkjokes,setdarkJokes] = useState([])
  useEffect(()=>{
    // now whereever our app may be running we provide proxy and use api endpoints like this
    // in react we add proxy in vite.config.js if using vite for cra we do it in package.json
    // how does it work if i wrote absolute url the browser sees it and sends a http request directly 
    // to the express server which causes cors warning 
    // but when I use /api/jokes it sees this as an relative path relative to what? 
    // where our react app is running it sends it to the vite dev server 
    // the dev server has proxy mapped for this and the dev server sends the request to our express server 
    // and gets the response based on the api endpoint in express app
    axios.get('/api/darkJokes')
    .then((response) => {
      setdarkJokes(response.data)
    })
    .catch((error) => {
      console.log(error);
    })
  })

  return (
    <>
        <h1>Jokes</h1>
        <p>JOKES: {darkjokes.length}</p>
        {darkjokes.map((joke)=>{
          return(
            <div key={joke.id}>
              <h3>{joke.title}</h3>
              <p>{joke.content}</p>
            </div>
          )
        })}
    </>
  )
}

export default DarkJokes