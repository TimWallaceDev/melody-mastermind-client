import "./Account.scss"
import { useEffect, useState } from "react"
import axios from "axios"

export function Account() {

    const username = localStorage.getItem("username")

    const [information, setInformation] = useState(null)


    useEffect(() => {
        async function getAccountData() {
            //make axios request to backend
            try {
                const username = localStorage.getItem("username")
                const response = await axios.get("http://localhost:8080/account/" + username)
                const data = response.data
                setInformation(data)
            } catch (err) {
                console.log(err)
            }
        }
        getAccountData()
    }, [username])

    if (!information) {
        return (
            <h1>Loading</h1>
        )
    }

    return (
        <section className="account">
            <h1 className="account__greeting">Hello, <span className="account__username">{username}</span></h1>
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