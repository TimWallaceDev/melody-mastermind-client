import { useEffect, useState, useRef } from "react"
import { PlaylistLeaderboard } from "../../components/PlaylistLeaderboard/PlaylistLeaderboard"
import "./Game.scss"
import { useParams, Navigate } from 'react-router-dom'
import axios from "axios"
import { v4 as uuid } from "uuid"
import { MusicVisualizer } from "../../components/MusicVisualizer/MusicVisualizer"
import testAudio from "../../assets/audio/05 Just the Two of Us.wav"


export function Game({ token }) {

    const { playlistId } = useParams()
    //scores for the leaderboard
    const [scores, setScores] = useState(null)
    const [currentScore, setCurrentScore] = useState(null)

    //save all tracks from the playlist
    const [playlistTracks, setPlaylistTracks] = useState(null)
    const [playlistImg, setPlaylistImg] = useState(null)
    const [playlistName, setPlaylistName] = useState(null)
    //keep track of score
    const [score, setScore] = useState(0)
    //pick the first track. This is the current track that is the correct answer
    const [currentTrack, setCurrentTrack] = useState(null)
    //set the index of the current track. This keeps track of which track in the playlist we are currently at
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
    //this is the list of indices that will be used to set the answers
    const [answers, setAnswers] = useState()
    const [gameOver, setGameOver] = useState(false)
    const [buttonsDisabled, setDisabled] = useState(false)
    const [answerCorrect, setAnswerCorrect] = useState(false)
    const [incorrectAnswer, setIncorrectAnswer] = useState(null)

    const modalRef = useRef()

    //get playlist tracks and set playlistTracks
    useEffect(() => {
        //get tracks from playlist
        async function getPlaylistTracks(playlistId) {
            try {
                //create header with token
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }

                //get tracks from spotify
                let response = await axios.get("https://api.spotify.com/v1/playlists/" + playlistId, config)
                console.log(response.data)
                setPlaylistImg(response.data.images[0].url)
                setPlaylistName(response.data.name)

                //save tracks to state
                setPlaylistTracks(response.data.tracks.items)

            } catch (err) {
                console.error(err)
            }
        }
        async function getScores() {
            // get scores
            const response = await axios.get("http://localhost:8080/scores/" + playlistId)
            const scores = response.data
            console.log({ scores })

            //save scores to state
            setScores(scores)

        }
        getScores()
        getPlaylistTracks(playlistId)

    }, [])

    function setupGame() {
        nextSong()
        //set current track
        setCurrentTrack(playlistTracks[currentTrackIndex])
        //get 3 other answers
        pickThreeRandomTracks()
        //set buttons to answers
        setButtons()
    }

    //set buttons at random to the values of the 4 track titles
    function setButtons() {
        let trackIndices = pickThreeRandomTracks()
        setAnswers(trackIndices)
    }

    //pick three other random songs from the playlist - make sure they are all unique
    function pickThreeRandomTracks() {
        //get the current tracks index
        const trackIndices = [currentTrackIndex]
        //continue adding to track index until 4 tracks are chosen
        while (trackIndices.length < 4) {
            let tmpIndex
            //create a random number
            do {
                tmpIndex = Math.ceil(Math.random() * playlistTracks.length - 1)
            }
            //while tmpIndex is in index, keep generating new indexes
            while (trackIndices.includes(tmpIndex))
            trackIndices.push(tmpIndex)
        }
        //shuffle indices
        for (let i = 0; i < 10; i++) {
            let randomIndex = Math.floor(Math.random() * 4)
            let randomSlice = trackIndices.splice(randomIndex, 1)
            trackIndices.push(randomSlice[0])
        }
        return trackIndices
    }

    //setup game once tracks are present
    useEffect(() => {
        if (!playlistTracks) {
            return
        }
        setupGame()
    }, [playlistTracks])

    function nextSong() {
        //hide correct answer
        setAnswerCorrect(false)

        //check that track has preview url
        const nextTrack = playlistTracks[currentTrackIndex]
        if (!nextTrack.track.preview_url) {
            setCurrentTrackIndex(currentTrackIndex + 1)
        }

        //set the track
        setCurrentTrack(playlistTracks[currentTrackIndex])

        //set the button
        setButtons()
    }

    //create useEffect runs when answer submitted
    useEffect(() => {
        if (!playlistTracks) {
            return
        }

        //hide modal
        modalRef.current.style.display = "none"

        nextSong()

    }, [currentTrackIndex])

    //handles answer submission
    async function handleAnswer(event, answer) {

        const currentTrackName = currentTrack.track.name

        //check if answer matches the current track
        if (answer === currentTrackName) {
            console.log("correct answer!!")
            setAnswerCorrect(true)

            //add current score to leaderboard
            const username = localStorage.getItem("username")
            const currentScore = { id: uuid(), username, score: score + 1, playlist_id: playlistId }
            setCurrentScore(currentScore)

            //increment score
            setScore(score + 1)

            //disable all buttons
            setDisabled(true)

            //show modal with next button
            modalRef.current.style.display = "block"

        }
        else {
            console.log("incorrect answer")
            //set chosen answer to red
            event.target.classList.add("game__button--incorrect")
            setIncorrectAnswer(answer)

            //disable all buttons
            setDisabled(true)

            //if no, game is over. show modal with game over, with button back to home page
            setGameOver(true)
            modalRef.current.style.display = "block"

            //post score to scores
            //username, score, playlistId, userid
            const username = localStorage.getItem("username")
            const params = { username, score, playlist_id: playlistId }
            try {
                const response = await axios.post("http://localhost:8080/scores", params)
                // console.log("server score response:", response)
                console.log("new score obj", response.data)

                //update leaderboard 
                setScores([...scores, response.data])
                setCurrentScore(null)

            } catch (err) {
                console.log(err)
            }
        }
    }

    //sets up next question
    function handleNext() {
        if (!gameOver) {
            //choose the next song
            setCurrentTrackIndex(currentTrackIndex + 1)

            //hide modal
            modalRef.current.style.display = "none"

            //enable buttons
            setDisabled(false)
        }
    }

    //resets game to beginning
    function handlePlayAgain() {
        window.location.reload()
    }

    //takes user to home page
    function handleGoHome() {
        window.history.back()
    }


    if (!playlistTracks || !answers || !currentTrack) {
        return <h1>Loading</h1>
    }

    return (
        <main className="game">
            <section className="game__container">
                <div className="game__information">
                    <img className="game__image" src={playlistImg}></img>
                    <h2 className="game__playlist-name">{playlistName}</h2>
                </div>
                <h3>Score: {score}</h3>
                <div className="audio-player">
                    {/* <audio id="audio" src={currentTrack.track.preview_url} autoPlay controls></audio> */}
                    <MusicVisualizer audioUrl={currentTrack.track.preview_url}/>

                </div>
                <div className="game__answers">
                    {/* display answer buttons using answers state */}
                    {answers.map(answer => {
                        const trackName = playlistTracks[answer].track.name
                        return (
                            <button className={` ${gameOver && trackName === currentTrack.track.name || answerCorrect && trackName === currentTrack.track.name ? "game__button game__button--correct" : " game__button"} ${incorrectAnswer === trackName ? "game__button--incorrect" : ""}`} disabled={buttonsDisabled} key={Math.random() * 999999} onClick={(event) => handleAnswer(event, trackName)}>{trackName}</button>
                        )
                    })}
                </div>
                <div className="game__modal" ref={modalRef}>
                    {!gameOver && <button className="game__modal-button" onClick={handleNext}>Next Song</button>}
                    {gameOver &&
                        <div className="game__end-options">
                            <button className="game__modal-button" onClick={handlePlayAgain}>Play Again</button>
                            <button className="game__modal-button" onClick={handleGoHome}>Go Home</button>
                        </div>
                    }
                </div>
            </section>
            <PlaylistLeaderboard scores={scores} currentScore={currentScore} />

        </main>
    )
}