import { useEffect, useState } from 'react';
import './App.scss';
import axios from 'axios';
import { Game } from './components/Game/Game';

function App() {
  const [token, setToken] = useState(null)
  const [tracks, setTracks] = useState(null)
  const BACKEND_PORT = "8080"
  const BACKEND_URL = "http://localhost:"

  //playlist variables
  const smokeBreak = "playlists/1qSQwiZA13xixRU8Rzacuz"

  useEffect(() => {
    //get token to use for authorization
    async function getToken() {
      
      //request token from backend
      let response = await axios.get(`${BACKEND_URL}${BACKEND_PORT}/token`)
      console.log(response)
      //save token in state
      setToken(response.data.access_token)
    }

    getToken()

  }, [])

  useEffect(() => {
    //get tracks from playlist
    async function getPlaylistTracks(playlist) {
      try {
        //create header with token
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        }

        //get tracks from spotify
        let response = await axios.get("https://api.spotify.com/v1/" + playlist, config)
        console.log(response.data.tracks.items)
        //save tracks to state
        setTracks(response.data.tracks.items)

      } catch (err) {
        console.error(err)
      }
    }

    getPlaylistTracks(smokeBreak)

  }, [token])



  if (!tracks){
    return (
      <h1>Loading</h1>
    )
  }

  return (
    <>
      <h1>Melody MasterMind</h1>
      <Game tracks={tracks}/>
    </>
  )
}

export default App
