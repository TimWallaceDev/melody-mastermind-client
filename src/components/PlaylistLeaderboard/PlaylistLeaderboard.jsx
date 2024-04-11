import "./PlaylistLeaderboard.scss"


export function PlaylistLeaderboard({scores}) {

    if (!scores) {
        return (
            <section className="leaderboard" >
                <h1>Loading</h1>
            </section>
        )
    }


    return (
        <section className="leaderboard" >
            <h1>Leaderboard</h1>
            {scores.sort((a, b) => a.score < b.score ? 1: -1).map((score, index) => {
                return (
                    <div key={score.id}className="score">
                        <h4 className="score__index">{index + 1}</h4>
                        <h4 className="score__username">{score.username}</h4>
                        <h5 className="score__score">{score.score}</h5>
                    </div>
                )
            })}
        </section>
    )
}