import { useEffect, useState } from 'react';
import './App.scss';
import axios from 'axios';
import { Home } from "./pages/Home/Home"
import { Game } from './pages/Game/Game';
import { Account } from './pages/Account/Account';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Leaderboards } from './pages/Leaderboards/Leaderboards';
import { Signup } from './pages/Signup/Signup';
import { Login } from './pages/Login/Login';

function App() {
  const [token, setToken] = useState(null)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    //get token to use for authorization
    async function getToken() {

      //request token from backend
      let response = await axios.get(`${backendUrl}/melody-mastermind/api/token`)
      //save token in state
      setToken(response.data.access_token)
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
    <HashRouter>
      <Routes>
        <Route path={"/melody-mastermind/"} element={<Login/>}/>
        <Route path={"/melody-mastermind/signup"} element={<Signup/>}/>
        <Route path={"/melody-mastermind/playlists"} element={<Home/>}/>
        <Route path={"/melody-mastermind/game/:playlistId"} element={<Game token={token} />} />
        <Route path={"/melody-mastermind/leaderboards"} element={<Leaderboards/>}/>
        <Route path={"/melody-mastermind/account"} element={<Account />}/>
      </Routes>
    </HashRouter>
  </>
)
}

export default App
