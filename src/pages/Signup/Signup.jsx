import "./Signup.scss"
import { useRef, useState } from "react"
import axios from "axios"
import { Navigate, useNavigate,Link } from "react-router-dom"
import logo from "../../assets/MMlogo.png"

export function Signup() {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const navigateTo = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const [errorMessage, setErrorMessage] = useState("")
    const errorMessageRef = useRef()


    async function handleSignup(e) {
        e.preventDefault()

        //check that username exists
        if (!username) {
            setErrorMessage("Please enter a Username")
            errorMessageRef.current.style.color = "red"
            return
        }

        if (!email) {
            setErrorMessage("Please enter an email")
            errorMessageRef.current.style.color = "red"
            return
        }

        //check that passwords are provided
        if (!password) {
            setErrorMessage("Please enter a password")
            errorMessageRef.current.style.color = "red"
            return
        }

        if (!passwordConfirm) {
            setErrorMessage("Please confirm password")
            errorMessageRef.current.style.color = "red"
            return
        }

        //check that passwords match

        if (password !== passwordConfirm) {
            setPasswordMessage("passwords do not match")
            errorMessageRef.current.style.color = "red"
            return
        }

        //send signup information to server
        try {
            const response = await axios.post(`${backendUrl}/melody-mastermind/api/account/signup`, { username, email, password })
            //TODO redirect to login page

            navigateTo("/melody-mastermind/#/melody-mastermind")

        } catch (err) {
            setErrorMessage("something went wrong with the signup....")
            errorMessageRef.current.style.color = "red"
            console.log(err)
        }

        <Navigate to="/melody-mastermind/#/melody-mastermind" />
    }

    async function handleUsernameChange(e) {
        const username = e.target.value
        setUsername(username)

        //check if username is available
        const isAvailable = await checkUsernameAvailable(username)

        //display message
        if (isAvailable) {
            setErrorMessage("Username available!")
            errorMessageRef.current.style.color = "green"
        }
        else {
            setErrorMessage("username already taken. Please choose another")
            errorMessageRef.current.style.color = "red"
        }
    }

    async function handlePasswordChange(e) {
        const password = e.target.value
        setPassword(password)
    }

    async function handlePasswordConfirmChange(e) {
        const passwordConfirm = e.target.value
        setPasswordConfirm(passwordConfirm)
    }

    async function handleEmailChange(e) {
        const email = e.target.value
        setEmail(email)
    }

    async function checkUsernameAvailable(username) {
        try {
            const response = await axios.post(`${backendUrl}/melody-mastermind/api/users/check`, { username: username })
            const available = response.data.username_available
            return available ? true : false
        } catch (err) {
            console.log(err)
            return false
        }
    }


    return (
        <section className="signup">

            <Link to="/melody-mastermind">
                <div className="signup__brand">
                    <img src={"/melody-mastermind" + logo} alt="melody mastermind logo" className="signup__logo" />
                    <h1 className="signup__name">Melody <br></br> MasterMind</h1>
                </div>
            </Link>

            <h1 className="signup__heading">Create Account</h1>

            <form className="signup__form" onSubmit={handleSignup}>
                <span className="create-account__message" ref={errorMessageRef}>{errorMessage}</span>
                <label htmlFor="signup__username" className="signup__label">Username</label>
                <input onChange={handleUsernameChange} value={username} type="text" id="signup__username" className="signup__username" placeholder="choose username" />

                <label htmlFor="signup__email" className="signup__label">Email</label>
                <input onChange={handleEmailChange} value={email} type="text" id="signup__email" className="signup__email" placeholder="Email" />

                <label htmlFor="signup__password" className="signup__label">Password</label>
                <input onChange={handlePasswordChange} value={password} type="password" id="signup__password" className="signup__password" placeholder="choose password" />

                <label htmlFor="signup__password--confirm" className="signup__label">Confirm Password</label>
                <input onChange={handlePasswordConfirmChange} value={passwordConfirm} type="password" id="signup-password--confirm" className="signup__password signup__password--confirm" placeholder="confirm password" />

                <button className="signup__button">Create Account</button>


            </form>
        </section>
    )
}