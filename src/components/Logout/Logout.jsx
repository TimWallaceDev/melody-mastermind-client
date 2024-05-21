import "./Logout.scss"
import { useNavigate } from "react-router-dom"
import logoutIcon from "../../assets/icons/icons8-logout-100.png"


export function Logout({ className, location }) {

    const navigateTo = useNavigate()

    function handleLogout() {
        //remove items from localStorage
        localStorage.removeItem("JWT")
        localStorage.removeItem("username")

        //redirect to login page
        navigateTo("/melody-mastermind/")

    }



    return (
        <li className={`${className} logout`} onClick={handleLogout}>
            {
                location === "navbar" &&

                <img className="navbar__icon" src={logoutIcon} alt="logout icon" />
            }
            <span className="navbar__text">Logout</span>


        </li>
    )
}