import "./Playlist.scss"
import { Link } from "react-router-dom"

export function Playlist({ playlist }) {

    return (
        <article className="playlist">
            <Link className="playlist__link" to={`/game/${playlist.playlistId}`}>
                <img className="playlist__image" src={playlist.playlistImg} alt="playlist image" />
                <h3 className="playlist__name">{playlist.name}</h3>
            </Link>
        </article>
    )
}