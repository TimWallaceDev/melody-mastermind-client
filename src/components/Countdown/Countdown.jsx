import "./Countdown.scss"
import { useRef, useEffect, useState } from "react"

export function Countdown({ track, trigger, gameOver, answerCorrect }) {

    const countdownRef = useRef()
    const [runningOutOfTime, setRunningOutOfTime] = useState(false)
    const [timeLeft, setTimeLeft] = useState(10)

    let first
    let second
    let last
    let clearMessage
    let interval

    useEffect(() => {
        countdownRef.current.classList.remove("countdown__progress")
        void countdownRef.current.offsetWidth; // Trigger reflow
        countdownRef.current.classList.add("countdown__progress")
        setRunningOutOfTime(false)
        clearTimeout(first)
        clearTimeout(second)
        clearTimeout(last)
        clearTimeout(clearMessage)
        first = setTimeout(firstWarning, 20000)
        clearMessage = setTimeout(clearCountdownMessage, 30000)

        return () => {
            clearTimeout(first);
            clearTimeout(clearMessage);
            clearInterval(interval);
        };

    }, [trigger])

    function firstWarning() {
        console.log("first warning")
        clearInterval(interval)
        interval = setInterval(updateTime, 1000)
        setRunningOutOfTime(true)
    }

    function clearCountdownMessage() {
        setRunningOutOfTime(false)
        clearInterval(interval)
        setTimeLeft(10)
    }

    function updateTime() {
        setTimeLeft((prev) => prev - 1)
    }


    let message = timeLeft > 1 ? timeLeft + " Seconds Left" : timeLeft + " Second Left"

    return (
        <>
            <div className="countdown">
                <div className="countdown__progress" key={track} ref={countdownRef}></div>
            </div>
            {(runningOutOfTime && !gameOver && !answerCorrect) &&
                <>
                    <div className="countdown__time">{message}</div>
                    {/* {timeLeft < 4 && <div className="countdown__message">HURRY UP</div>} */}
                </>

            }

        </>
    )
}