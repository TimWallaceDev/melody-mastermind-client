import { useRef, useState, useEffect } from "react"
import "./Login.scss"
import axios from 'axios'
import logo from "../../assets/MMlogo.png"
import { Link, useNavigate } from "react-router-dom"

export function Login() {

    const navigateTo = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [passwordMessage, setPasswordMessage] = useState("")

    const errorMessageRef = useRef()
    const passwordMessageRef = useRef()

    useEffect(() => {
        function checkForAuthorization() {
            const JWT = localStorage.getItem("JWT")
            if (JWT) {
                navigateTo("/playlists")
            }
        }
        checkForAuthorization()
    }, [])

    async function handlePasswordChange(e) {
        const password = e.target.value
        setPassword(password)
    }

    function handleUsernameChange(e) {
        const username = e.target.value
        setUsername(username)
    }

    async function handleLogin(e) {
        //prevent form from submitting and refreshing page
        e.preventDefault()

        console.log("logging in")

        //check that username has been provided
        if (!username) {
            setErrorMessage("Please enter a username")
            errorMessageRef.current.style.color = "red"
            return
        }
        //check that password has been provided
        if (!password) {
            setPasswordMessage("Please enter a password")
            passwordMessageRef.current.style.color = "red"
            return

        }

        //send login information to backend
        try {
            const response = await axios.post("http://localhost:8080/account/login", { username, password })

            //TODO save jwt in localstorage
            console.log({ response });
            localStorage.setItem("JWT", response.data);
            localStorage.setItem("username", username)

            //navigate to playlists
            navigateTo("/playlists")
        } catch (err) {
            console.log(err)
            return
        }

        //close modal
        modalRef.current.style.display = "none";
    }

    async function handleGuest(e) {
        //prevent form from submitting and refreshing page
        e.preventDefault()
        console.log("signing up as guest")

        //make request to server for a guest account
        try {
            const response = await axios.post("http://localhost:8080/account/guest")
            console.log(response)

            //server will send back a JWT for guest to use
            //save jwt in localstorage
            const JWT = response.data.token
            const username = response.data.username
            console.log(JWT, username)
            localStorage.setItem("JWT", JWT)
            localStorage.setItem("username", username)
            navigateTo("/playlists")
        }catch(err){
            console.log(err)
        }
        

        

    }


    return (
        <section className="username-modal">
            <div className="username-modal__wrapper">

                <div className="username-modal__brand">
                    <img src={logo} alt="" className="username-modal__logo" />
                    <h1 className="username-modal__name">Melody <br></br> MasterMind</h1>
                </div>

                <section className="login">
                    <form className="login__form" onSubmit={handleLogin}>
                        <h2 className="login__heading">Log In</h2>
                        <span className="login__message" ref={errorMessageRef}>{errorMessage}</span>
                        <label className="login__label">Username</label>
                        <input className="login__input" type="text" placeholder="Username" value={username} onChange={handleUsernameChange}></input>

                        <span className="login__message" ref={errorMessageRef}>{passwordMessage}</span>
                        <label className="login__label">Password</label>
                        <input type="password" className="login__input" placeholder="Password" onChange={handlePasswordChange} />
                        <button className="login__submit">Log In</button>
                    </form>
                </section>

                <section className="guest">
                    <form className="guest__form" onSubmit={handleGuest}>
                        <button className="guest__button">
                            Continue as Guest
                        </button>
                    </form>
                </section>

                <section className="signup">
                    <Link to={"/signup"}>
                        <button className="signup__button">
                            Sign Up
                        </button>
                    </Link>

                </section>

            </div>
        </section>
    )
}