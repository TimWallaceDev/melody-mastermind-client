import { useState, useRef } from "react"
import "./Countdown.scss"

export function Countdown({track}){

    console.log("rendering countown")

    return (
        <div className="countdown">
            <div className="countdown__progress" key={track}></div>
        </div>
    )
}