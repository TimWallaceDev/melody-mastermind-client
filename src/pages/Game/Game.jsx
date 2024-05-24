//functions
import { useEffect, useState, useRef } from "react"
import { useParams } from 'react-router-dom'
import axios from "axios"
import { v4 as uuid } from "uuid"
import { handleGoHome, handlePlayAgain } from "../../utils/gameUtils"
//components
import { PlaylistLeaderboard } from "../../components/PlaylistLeaderboard/PlaylistLeaderboard"
import AudioSpectrum from "react-audio-spectrum"
import { Countdown } from "../../components/Countdown/Countdown"
import { scrollToNext } from "../../utils/gameUtils"
import { MobileNavbar } from "../../components/MobileNavbar/MobileNavbar"
import { DesktopNavbar } from "../../components/DesktopNavbar/DesktopNavbar"
//styles
import "./Game.scss"

export function Game({ token }) {

    //backend request url
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    //current playlist ID
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
    const [currentTrackIndex, setCurrentTrackIndex] = useState(97)
    //this is the list of indices that will be used to set the answers
    const [answers, setAnswers] = useState()
    const [gameOver, setGameOver] = useState(false)
    const [gameWon, setGameWon] = useState(false)
    const [buttonsDisabled, setDisabled] = useState(false)
    const [answerCorrect, setAnswerCorrect] = useState(false)
    const [incorrectAnswer, setIncorrectAnswer] = useState(null)
    const [isOutOfTime, setIsOutOfTime] = useState(false)
    //timer state
    const [startTime, setStartTime] = useState()
    const [points, setPoints] = useState()

    const modalRef = useRef()
    const audioRef = useRef()
    const startGameModalRef = useRef()

    //get playlist tracks and save in state
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
            const response = await axios.get(`${backendUrl}/melody-mastermind/api/scores/${playlistId}`)
            const scores = response.data

            //save scores to state
            setScores(scores)

        }
        getScores()
        getPlaylistTracks(playlistId)

    }, [])

    //setup game once tracks are present
    useEffect(() => {
        if (!playlistTracks) {
            return
        }
        setupGame()
    }, [playlistTracks])

    function setupGame() {
        //set current track index
        chooseNextSong()
        //set audio src
        setCurrentTrack(playlistTracks[currentTrackIndex])
        //set answers
        pickThreeRandomTracks()
        setButtons()
        //hide correct answer
        setAnswerCorrect(false)
        //show start game modal
        // startGameModalRef.current.style.display = "flex"
    }

    function startGame() {
        //hide modal
        startGameModalRef.current.style.display = "none"
        //start audio
        audioRef.current.play()
        //start timer
        startTimer()
        //trigger animation

    }

    //create useEffect runs when answer submitted
    useEffect(() => {
        if (!playlistTracks) {
            return
        }

        //hide modal
        modalRef.current.style.display = "none"

        chooseNextSong()

    }, [currentTrackIndex])

    //handles answer submission
    async function handleAnswer(event, answer) {

        //stop timer
        const endTime = Date.now()

        const currentTrackName = currentTrack.track.name

        //check if answer matches the current track
        if (answer === currentTrackName) {
            setAnswerCorrect(true)

            //calculate time
            let time = 1000 - Math.floor((endTime - startTime) / 30)
            if (time < 0) {
                time = 0
            }

            //save points to state
            setPoints(time)

            //add current score to leaderboard
            const username = localStorage.getItem("username")
            const currentScore = { id: uuid(), username, score: score + time, playlist_id: playlistId }
            setCurrentScore(currentScore)

            //increment score
            setScore(score + time)

            //disable all buttons
            setDisabled(true)

            //show modal with next button
            modalRef.current.style.display = "block"

            //scroll next next button
            scrollToNext()

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

            postScoreToServer()
        }
    }

    //sets up next question
    async function handleNext() {
        if (!gameOver) {
            //choose the next song
            setCurrentTrackIndex(currentTrackIndex + 1)
            chooseNextSong()

            //set the audio 
            setCurrentTrack(playlistTracks[currentTrackIndex])
            audioRef.current.autoplay = "true"

            //enable buttons
            setDisabled(false)

            //hide correct answer
            setAnswerCorrect(false)

            //play audio
            try {
                await audioRef.current.play()
            } catch (err) {
                console.log(err)
            }

            //scroll to audio canvas
            window.scrollTo({
                top: document.getElementById("game__score").offsetTop - 16,
                behavior: 'smooth' // Optional: smooth scrolling animation
            });
        }
    }

    // -----------------------------------------------   HELPER FUNCTIONS -----------------------------------------------------

    async function chooseNextSong() {

        //check that track has preview url
        const nextTrack = playlistTracks[currentTrackIndex]
        if (!nextTrack) {
            //end game

            //show modal with game over, with button back to home page
            setGameOver(true)
            setGameWon(true)
            modalRef.current.style.display = "block"
            postScoreToServer()
            return
        }

        if (!nextTrack.track.preview_url) {
            //make sure the next track is not undefined
            if (playlistTracks[currentTrackIndex + 1]) {
                setCurrentTrackIndex(currentTrackIndex + 1)
            }
        }

        //set the track
        setCurrentTrack(playlistTracks[currentTrackIndex])

        //set the button
        setButtons()
    }

    function outOfTime() {
        if (!answerCorrect && !gameOver) {
            setIsOutOfTime(true)
            setGameOver(true)
            postScoreToServer()
            //show modal with next button
            modalRef.current.style.display = "block"
            //scroll next next button
            scrollToNext(150)
        }
    }

    function startTimer() {
        const startTime = Date.now()
        setStartTime(startTime)
    }

    async function postScoreToServer() {
        //post score to scores
        //username, score, playlistId, userid
        const username = localStorage.getItem("username")
        const params = { username, score, playlist_id: playlistId }
        try {
            const response = await axios.post(`${backendUrl}/melody-mastermind/api/scores`, params)

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

    if (!playlistTracks || !answers || !currentTrack) {
        return <h1>Loading</h1>
    }

    return (
        <>
            <DesktopNavbar />
            <MobileNavbar />

            <div className="start-game-modal" ref={startGameModalRef}>
                <div className="start-game-modal__information">
                    <img className="start-game-modal__image" src={playlistImg}></img>
                    <h2 className="start-game-modal__playlist-name">{playlistName}</h2>
                </div>
                <button className="start-game-modal__button" onClick={startGame}>Start Game</button>
            </div>

            <main className="game">
                <section className="game__container">
                    <div className="game__information">
                        <img className="game__image" src={playlistImg}></img>
                        <h2 className="game__playlist-name">{playlistName}</h2>
                    </div>
                    <div className="game__main">
                        <h3 className="game__score" id="game__score">Score: {score.toLocaleString()}</h3>
                        <div className="audio">
                            <audio
                                className="audio__player"
                                id="audio"
                                src={currentTrack.track.preview_url}
                                controls
                                crossOrigin="anonymous"
                                onEnded={outOfTime}
                                ref={audioRef}
                                onPlaying={startTimer}
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
                        <Countdown length={30} track={currentTrackIndex} trigger={startTime} gameOver={gameOver} answerCorrect={answerCorrect} />
                        <div className="game__answers">
                            {/* display answer buttons using answers state */}
                            {answers.map(answer => {
                                const trackName = playlistTracks[answer].track.name
                                return (
                                    <button className={` ${gameOver && trackName === currentTrack.track.name || answerCorrect && trackName === currentTrack.track.name ? "game__button game__button--correct" : " game__button"} ${incorrectAnswer === trackName ? "game__button--incorrect" : ""}`} disabled={buttonsDisabled} key={Math.random() * 999999} onClick={(event) => handleAnswer(event, trackName)}>{trackName}</button>
                                )
                            })}
                        </div>
                        <div className="game__modal" ref={modalRef} id="modal">
                            {!gameOver &&
                                <>
                                    <div className="game__points">+ {points} Points</div>
                                    <button className="game__modal-button game__modal-button--next" onClick={handleNext}>Next Song</button>
                                </>}

                            {(gameOver && gameWon) && <h2>You beat the Game!</h2>}
                            {(gameOver && isOutOfTime) && <h2>Out of Time!</h2>}
                            {gameOver &&
                                <>
                                    <h2 className="game__final-score">Final Score: {score.toLocaleString()}</h2>
                                    <div className="game__end-options">
                                        <button className="game__modal-button game__modal-button--play-again" onClick={handlePlayAgain}>Play Again</button>
                                        <button className="game__modal-button game__modal-button--playlists" onClick={handleGoHome}>Playlists</button>
                                    </div>
                                </>
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
        </>
    )
}