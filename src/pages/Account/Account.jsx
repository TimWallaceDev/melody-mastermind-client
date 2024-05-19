import "./Account.scss"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export function Account() {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [information, setInformation] = useState(null)

    const [JWT] = useState(localStorage.getItem("JWT"))

    const navigate = useNavigate()

    useEffect(() => {
        async function getAccountData() {
            //make axios request to backend
            try {
                const response = await axios.get(`${backendUrl}/api/account`, {headers: {Authorization: `Bearer ${JWT}`}})
                const data = response.data
                setInformation(data)
            } catch (err) {
                console.log(err)
            }
        }

        //check for username
        if (!JWT) {
            
            navigate("/")
        }

        getAccountData()
    }, [])

    if (!information) {
        return (
            <h1>Loading</h1>
        )
    }

    return (
        <section className="account">
            <h1 className="account__greeting">Hello, <span className="account__username">{information.username}</span></h1>
            <div className="account__informations">

                <span className="account__information">
                    <span className="account__information-label">Games Played:</span>
                    <span className="account__information-info">{information.games_played}</span>
                </span>
                <span className="account__information">
                    <span className="account__information-label">Top Score: </span>
                    <span className="account__information-info">{information.highest_score}</span>
                </span>
                <span className="account__information">
                    <span className="account__information-label">Best Playlist: </span>
                    <span className="account__information-info">{information.best_playlist}</span>
                </span>
                <span className="account__information">
                    <span className="account__information-label">Most Played Playlist: </span>
                    <span className="account__information-info">{information.most_played}</span>
                </span>
                <span className="account__information">
                    <span className="account__information-label">Number of different Playlists Played: </span>
                    <span className="account__information-info">{information.playlists_played}</span>
                </span>
            </div>

        </section>
    )
}