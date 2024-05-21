


//takes user to home page
export function handleGoHome() {
    window.history.back()
}


//resets game to beginning
export function handlePlayAgain() {
    window.location.reload()
}

//pick three other random songs from the playlist - make sure they are all unique
export function pickThreeRandomTracks() {
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


//set buttons at random to the values of the 4 track titles
export function setButtons() {
    let trackIndices = pickThreeRandomTracks()
    setAnswers(trackIndices)
}


export function checkForNextSong() {
    if (playlistTracks[currentTrackIndex + 1]) {
        return true
    }
    else {
        return false
    }
}

export async function postScoreToServer() {
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



//sets up next question
export async function handleNext() {
    if (!gameOver) {
        //choose the next song

        //make sure the next track is not undefined
        if (checkForNextSong()) {
            setCurrentTrackIndex(currentTrackIndex + 1)
        }
        else {
            //end game, no more tracks available

            //if no, game is over. show modal with game over, with button back to home page
            setGameOver(true)
            setGameWon(true)
            modalRef.current.style.display = "block"

            //post score to server
            postScoreToServer()

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


export function scrollToNext() {
    const element = document.getElementById('modal');
    const offset = 120; // Extra offset for the fixed navbar

    // Get the element's position relative to the viewport
    const elementRect = element.getBoundingClientRect();
    
    // Calculate the absolute top position of the element
    const absoluteElementTop = elementRect.top + window.pageYOffset;

    // Calculate the target scroll position
    const scrollPosition = absoluteElementTop - window.innerHeight + elementRect.height + offset;

    // Scroll to the calculated position with smooth behavior
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
  }