import "./Home.scss"
import { Playlist } from "../../components/Playlist/Playlist"
import playlistsData from "../../data/playlists.json"
import { UsernameModal } from "../../components/UsernameModal/UsernameModal"

export function Home() {

    return (
        <section className="home">

            <h1>Choose a Playlist</h1>

            <div className="home__playlists">

                {playlistsData.map(playlist => <Playlist key={playlist.playlistId} playlist={playlist} />)}

            </div>
            <UsernameModal/>
        </section>
    )
}