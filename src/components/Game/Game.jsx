import { useEffect, useState } from "react"

//what index we are at
//the correct song
//the 3 wrong answers
//the score



export function Game({tracks}){

    //pick the first track
    const [currentTrack, setCurrentTrack] = useState(tracks[0])
    //set the index of the current track
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
    const [answers, setAnswers] = useState()
    //set audio src to the preview of the fist track
    const [audioUrl, setAudioUrl] = useState(currentTrack.track.preview_url)
    const answer1 = "answer1"
    const answer2 = "answer2"
    const answer3 = "answer3"
    const answer4 = "answer4"


    console.log(currentTrack.track)
    console.log(currentTrack.track.preview_url)

    

    //pick three other random songs from the playlist - make sure they are all unique

    function pickThreeRandomTracks(){
        //get the current tracks index
        const trackIndices = [currentTrackIndex]

        //continue adding to track index until 4 tracks are chosen

        while (trackIndices.length < 4){
            let tmpIndex
            do {
                tmpIndex = Math.ceil(Math.random() * 100)
            }
            //while tmpIndex is in index, keep generating new indexes
            while (trackIndices.indexOf(tmpIndex) !== -1){
                tmpIndex = Math.ceil(Math.random() * 100)
            }
            trackIndices.push(tmpIndex)
        }

        console.log(JSON.stringify(trackIndices))

        //shuffle indices
        for (let i = 0; i < 10; i++){
            let randomIndex = Math.floor(Math.random() * 4)
            let randomSlice = trackIndices.splice(randomIndex, 1)
            trackIndices.push(randomSlice[0])
        }

        console.log({trackIndices})


        return trackIndices
    }

    

    //set buttons at random to the values of the 4 track titles
    function setButtons(){
        let trackIndices = pickThreeRandomTracks()
        setAnswers(trackIndices)
    }

    //

    useEffect(() => {

        setButtons()
    }, [])


    return (
        <main className="game">
            <h2>Question {currentTrackIndex + 1}</h2>
            <div className="audio-player">
                <audio src={audioUrl} autoPlay controls></audio>
            </div>
            <section className="answers">
                <button className="answers__button">{answer1 || "answer1"}</button>
                <button className="answers__button">{answer2 || "answer1"}</button>
                <button className="answers__button">{answer3 || "answer1"}</button>
                <button className="answers__button">{answer4 || "answer1"}</button>
            </section>
        </main>
    )
}