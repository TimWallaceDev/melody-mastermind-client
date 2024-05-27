import "./Instructions.scss"
import { useRef } from "react"

export function Instructions(){

    const instructionsRef = useRef()

    //check loccalStorage to see if instructions have been seen before

    const hasSeenInstructions = localStorage.getItem("hasSeenInstructions")

    //do not show instructions if user has already seen them
    if (hasSeenInstructions){
        return
    }

    function handleCloseInstructions(){
        instructionsRef.current.style.display = "none";
        localStorage.setItem("hasSeenInstructions", "true")
    }

    return (

        <div className="instructions" ref={instructionsRef}>
            <h4 className="instructions__heading">How to Play</h4>
            <ol className="instructions__list">
                <li className="instructions__list-item">Choose your favorite playlist</li>
                <li className="instructions__list-item">Click the title of the song playing</li>
                <li className="instructions__list-item">The faster you answer, the more points you earn!</li>
                <li className="instructions__list-item">Be careful! If you choose the wrong answer, the game ends!</li>
                <li className="instructions__list-item">Try and get to the top of the leader board</li>
            </ol>
            <button className="instructions__button" onClick={handleCloseInstructions}>Hide Instructions</button>
        </div>
    )
}