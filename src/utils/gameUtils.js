


//takes user to home page
export function handleGoHome() {
    window.history.back()
}


//resets game to beginning
export function handlePlayAgain() {
    window.location.reload()
}

export function checkForNextSong(){

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