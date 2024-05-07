import "./Header.scss"
import logo from "../../assets/MMlogo.png"
import { Link } from 'react-router-dom'
import { Logout } from "../Logout/Logout"

export function Header() {

    return (
        <header className="header">

            <Link to={"/"} className="header__brand-link">
                <div className="header__brand">
                    <img src={logo} alt="" className="header__logo" />
                    <h1 className="header__name">Melody <br></br> MasterMind</h1>
                </div>
            </Link>

            <div className="header__links">
                <ul className="header__items">
                    <li className="header__item">
                        <Link to={"/"} className="header__link">
                            Playlists
                        </Link>
                    </li>
                    <li className="header__item">
                        <Link to={"/leaderboards"} className="header__link">
                            Leaderboards
                        </Link>
                    </li>
                    <li className="header__item">
                        <Link to={"/account"} className="header__link">
                            Account
                        </Link>
                    </li>

                    {<Logout className="header__item"/>}
                </ul>
            </div>



        </header>
    )
}