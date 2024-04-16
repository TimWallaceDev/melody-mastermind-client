import "./Countdown.scss"

export function Countdown({track}){

    return (
        <div className="countdown">
            <div className="countdown__progress" key={track}></div>
        </div>
    )
}