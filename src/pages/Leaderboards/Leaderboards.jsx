import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Leaderboards.scss"
import axios from "axios"
import { MobileNavbar } from "../../components/MobileNavbar/MobileNavbar"
import { DesktopNavbar } from "../../components/DesktopNavbar/DesktopNavbar"

export function Leaderboards() {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [scores, setScores] = useState(null)

    const [username] = useState(localStorage.getItem("JWT"))

    const [playlistData, setPlaylistData] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        async function getScores() {
            //request scores from backend
            const response = await axios.get(`${backendUrl}/melody-mastermind/api/scores`)
            setScores(response.data.scores)
            setPlaylistData(response.data.playlists)
        }
        //if no username, redirect home
        if (!username) {
            navigate("/")
        }
        getScores()
    }, [])


    if (!scores) {
        return <h1>Loading scores</h1>
    }

    const tables = []

    function sortScores() {
        //get list of individual playlists
        const playlistIds = []

        for (let score of scores) {
            const playlist_id = score.playlist_id
            if (playlistIds.indexOf(playlist_id) === -1) {
                playlistIds.push(playlist_id)
            }
        }

        const scoresArr = []

        //map over playlists

        for (let playlistId of playlistIds) {

            //get playlist title
            const playlistName = playlistData.find(playlist => playlist.id === playlistId)

            //get all scores for each playlist / sort scores 
            const tmpScores = scores.filter(score => score.playlist_id === playlistId).sort((a, b) => a.score > b.score ? -1 : 1).slice(0, 10)
            const tmpScoreObj = { playlistName: playlistName.name, scores: tmpScores }
            scoresArr.push(tmpScoreObj)
        }



        //create table with scores for each playlist
        for (let playlist of scoresArr) {
            const board =
                <article className="leaderboards__leaderboard" key={playlist.playlistName}>
                    <h2 className="leaderboard__name">{playlist.playlistName}</h2>

                    <div className="leaderboard__scores">
                        <div className="score">
                            <h4 className="score__index score__index--heading">Rank</h4>
                            <h5 className="score__score score__score--heading">Score</h5>
                            <h4 className="score__username score__username--heading">Username</h4>
                        </div>
                        {playlist.scores.map((score, index) => {
                            let className = "score__index"
                            switch (index) {
                                case 0:
                                    className += " score__index--gold"
                                    break;
                                case 1:
                                    className += " score__index--silver"
                                    break;
                                case 2:
                                    className += " score__index--bronze"
                                    break;
                            }

                            return (
                                <div key={score.id} className="score">
                                    <h4 className={className}>{index + 1}</h4>
                                    <h4 className="score__score">{score.score.toLocaleString()}</h4>
                                    <h4 className="score__username">{score.username}</h4>
                                </div>
                            )
                        })}
                    </div>
                </article>
            tables.push(board)
        }
    }

    sortScores()


    return (
        <>
            <DesktopNavbar />
            <MobileNavbar />
            <section className="leaderboards">
                <h1>Leaderboards</h1>
                <div className="leaderboards__wrapper">
                    {tables}
                </div>
            </section>
        </>
    )
}