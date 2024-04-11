import { useEffect, useState } from 'react';
import './App.scss';
import axios from 'axios';
import { Home } from "./pages/Home/Home"
import { Game } from './pages/Game/Game';
import { Navbar } from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Leaderboards } from './pages/Leaderboards/Leaderboards';

function App() {
  const [token, setToken] = useState(null)

  const BACKEND_PORT = "8080"
  const BACKEND_URL = "http://localhost:"



  useEffect(() => {
    //get token to use for authorization
    async function getToken() {

      //request token from backend
      let response = await axios.get(`${BACKEND_URL}${BACKEND_PORT}/token`)
      //save token in state
      setToken(response.data.access_token)
      console.log(response.data.access_token)
    }

    getToken()
    
    
  }, [])

if (!token) {
  return (
    <h1>Loading</h1>
  )
}

return (
  <>
    <BrowserRouter>
      <h1>Melody MasterMind</h1>
      <Navbar />
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/game/:playlistId"} element={<Game token={token} />} />
        <Route path={"/leaderboards"} element={<Leaderboards/>}/>
      </Routes>
    </BrowserRouter>
  </>
)
}

export default App
