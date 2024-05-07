//functions
import { useEffect, useState, useRef } from "react"
import { useParams } from 'react-router-dom'
import axios from "axios"
import { v4 as uuid } from "uuid"
//utils
import { handleGoHome, handlePlayAgain, pickThreeRandomTracks, setButtons } from "../../utils/gameUtils"
//components
import { PlaylistLeaderboard } from "../../components/PlaylistLeaderboard/PlaylistLeaderboard"
import AudioSpectrum from "react-audio-spectrum"
import { Countdown } from "../../components/Countdown/Countdown"
//styles
import "./Game.scss"


export function Game({ token }) {
    console.log(token)

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
    const [gameWon, setGameWon] = useState(false)
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

    

    

    //setup game once tracks are present
    useEffect(() => {
        if (!playlistTracks) {
            return
        }
        setupGame()
    }, [playlistTracks])

    async function nextSong() {
        //hide correct answer
        setAnswerCorrect(false)

        //check that track has preview url
        const nextTrack = playlistTracks[currentTrackIndex]
        if (!nextTrack.track.preview_url) {
            //make sure the next track is not undefined
            if (playlistTracks[currentTrackIndex + 1]) {
                console.log("next track: " + playlistTracks[currentTrackIndex + 1])
                setCurrentTrackIndex(currentTrackIndex + 1)
            }
            else {
                //end game
                console.log("you won!")

                //if no, game is over. show modal with game over, with button back to home page
                setGameOver(true)
                setGameWon(true)
                modalRef.current.style.display = "block"

                //post score to scores
                //username, score, playlistId, userid
                const username = localStorage.getItem("username")
                const params = { username, score, playlist_id: playlistId }
                try {
                    const response = await axios.post("http://localhost:8080/scores", params)

                    //add current score to leaderboard
                    const username = localStorage.getItem("username")
                    const currentScore = { id: uuid(), username, score: score, playlist_id: playlistId }
                    setCurrentScore(currentScore)

                    //scroll to bottom
                    window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: 'smooth' // Optional: smooth scrolling animation
                    });

                } catch (err) {
                    console.log(err)
                }

                console.log("You won the game!")
            }
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

            //scroll to bottom
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth' // Optional: smooth scrolling animation
            });

        }
        else {
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

                //add current score to leaderboard
                const username = localStorage.getItem("username")
                const currentScore = { id: uuid(), username, score: score, playlist_id: playlistId }
                setCurrentScore(currentScore)

                //scroll to bottom
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth' // Optional: smooth scrolling animation
                });

            } catch (err) {
                console.log(err)
            }
        }
    }

    //sets up next question
    async function handleNext() {
        if (!gameOver) {
            //choose the next song

            //make sure the next track is not undefined
            if (playlistTracks[currentTrackIndex + 1]) {
                console.log("next track: " + playlistTracks[currentTrackIndex + 1])
                setCurrentTrackIndex(currentTrackIndex + 1)
            }
            else {
                //end game
                console.log("you won!")

                //if no, game is over. show modal with game over, with button back to home page
                setGameOver(true)
                setGameWon(true)
                modalRef.current.style.display = "block"

                //post score to scores
                //username, score, playlistId, userid
                const username = localStorage.getItem("username")
                const params = { username, score, playlist_id: playlistId }
                try {
                    const response = await axios.post("http://localhost:8080/scores", params)

                    //add current score to leaderboard
                    const username = localStorage.getItem("username")
                    const currentScore = { id: uuid(), username, score: score, playlist_id: playlistId }
                    setCurrentScore(currentScore)

                    //scroll to bottom
                    window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: 'smooth' // Optional: smooth scrolling animation
                    });

                } catch (err) {
                    console.log(err)
                }

                console.log("You won the game!")
            }

            //enable buttons
            setDisabled(false)

            //scroll to audio canvas
            window.scrollTo({
                top: document.getElementById("game__score").offsetTop - 16,
                behavior: 'smooth' // Optional: smooth scrolling animation
            });
        }
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
                <div className="game__main">
                    <h3 className="game__score" id="game__score">Score: {score}</h3>
                    <div className="audio">
                        <audio
                            className="audio__player"
                            id="audio"
                            src={currentTrack.track.preview_url}
                            autoPlay
                            controls
                            crossOrigin="anonymous"
                        ></audio>
                        <AudioSpectrum
                            className="audio__visualizer"
                            id="audio-canvas"
                            height={200}
                            width={300}
                            audioId={'audio'}
                            capColor={'red'}
                            capHeight={2}
                            meterWidth={12}
                            meterCount={200}
                            meterColor={[
                                { stop: 0, color: 'purple' },
                                { stop: 0.5, color: 'green' },
                                { stop: 1, color: 'red' }
                            ]}
                            gap={4}
                        />

                    </div>
                    <Countdown length={30} track={currentTrackIndex} />
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
                        {!gameOver && <button className="game__modal-button game__modal-button--next" onClick={handleNext}>Next Song</button>}
                        
                        {(gameOver && gameWon) && <h2>You beat the Game!</h2>}
                        {gameOver &&
                            <div className="game__end-options">
                                <button className="game__modal-button game__modal-button--play-again" onClick={handlePlayAgain}>Play Again</button>
                                <button className="game__modal-button game__modal-button--playlists" onClick={handleGoHome}>Playlists</button>
                            </div>
                        }
                    </div>
                </div>


                <div className="game__right-wrapper">
                    <div className="game__left">
                        <div className="game__information--left">
                            <img className="game__image" src={playlistImg}></img>
                            <h2 className="game__playlist-name">{playlistName}</h2>
                        </div>

                        <PlaylistLeaderboard scores={scores} currentScore={currentScore} />
                    </div>
                </div>


            </section>


        </main>
    )
}