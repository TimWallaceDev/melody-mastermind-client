import "./Header.scss"
import logo from "../../assets/MMlogo.png"

export function Header(){

    return(
        <header className="header">

            <div className="header__brand">
                <img src={logo} alt="" className="header__logo" />
                <h1 className="header__name">Melody <br></br> MasterMind</h1>
            </div>

        </header>
    )
}