import "./PlaylistLeaderboard.scss"


export function PlaylistLeaderboard({ scores, currentScore }) {


    if (!scores) {
        return (
            <section className="leaderboard" >
                <h1>Loading</h1>
            </section>
        )
    }

    const unifiedScores = currentScore ? [...scores, { ...currentScore, currentScore: true }] : scores

    return (
        <section className="leaderboard" >
            <div className="leaderboard__headings">
                <h4 className="leaderboard__headings--index">Rank</h4>
                <h4 className="leaderboard__headings--score">Score</h4>
                <h4 className="leaderboard__headings--username">User</h4>

            </div>
            {unifiedScores.sort((a, b) => a.score < b.score ? 1 : -1).slice(0, 10).map((score, index) => {
                let className = score.currentScore ? "score__index score__index--current" : "score__index"
                switch (index) {
                    case 0:
                        className += " score__index--gold"
                        break;
                    case 1:
                        className += " score__index--silver"
                        break;
                    case 2:
                        className += " score__index--bronze"
                        break;
                }
                return (
                    <div key={score.id} className={score.currentScore ? "score score--current" : "score"}>
                        <h4 className={className}>{index + 1}</h4>
                        <h5 className={score.currentScore ? "score__score score__score--current" : "score__score" }>{score.score.toLocaleString()}</h5>
                        <h4 className={score.currentScore ? "score__username score__username--current" : "score__username"}>{score.username}</h4>
                    </div>
                )
            })}
        </section>
    )
}