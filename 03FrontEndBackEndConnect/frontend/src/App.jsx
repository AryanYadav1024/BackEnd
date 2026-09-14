
import './App.css'

import { Link,Outlet } from "react-router-dom";

function App() {
  return(
    <>
      <Link to='Jokes'>Jokes</Link>
      <Link to='DarkJokes'>DarkJokes</Link>
      <Outlet />
    </>
  )
}

export default App
