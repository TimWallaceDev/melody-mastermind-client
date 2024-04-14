import { useEffect, useState } from "react"
import "./Leaderboards.scss"
import axios from "axios"
import playlistData from "../../data/playlists.json"

export function Leaderboards() {

    const [scores, setScores] = useState(null)

    useEffect(() => {
        async function getScores() {
            //request scores from backend
            const response = await axios.get("http://localhost:8080/scores")
            setScores(response.data)
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
            const playlistName = playlistData.find(playlist => playlist.playlistId === playlistId)

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
                            <h4 className="score__index">Rank</h4>
                            <h5 className="score__score">Score</h5>
                            <h4 className="score__username">Username</h4>
                        </div>
                        {playlist.scores.map((score, index) => {
                            return (
                                <div key={score.id} className="score">
                                    <h4 className="score__index">{index + 1}</h4>
                                    <h5 className="score__score">{score.score}</h5>
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

        <section className="leaderboards">
            <h1>Leaderboards</h1>
            <div className="leaderboards__wrapper">
                {tables}
            </div>
        </section>
    )
}