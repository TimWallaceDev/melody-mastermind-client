import "./Signup.scss"
import { useRef, useState } from "react"
import axios from "axios"
import { Navigate, useNavigate } from "react-router-dom"

export function Signup() {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const navigateTo = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const [usernameMessage, setUsernameMessage] = useState("")
    const usernameMessageRef = useRef()

    const [passwordMessage, setPasswordMessage] = useState("")
    const passwordMessageRef = useRef()

    
    const [emailMessage, setEmailMessage] = useState("")
    const emailMessageRef = useRef()


    async function handleSignup(e) {
        e.preventDefault()

        //check that username exists
        if (!username){
            setUsernameMessage("Please enter a Username")
            usernameMessageRef.current.style.color = "red"
            return
        }

        if (!email){
            setEmailMessage("Please enter an email")
            usernameMessageRef.current.style.color = "red"
            return
        }

        //check that passwords are provided
        if (!password){
            setPasswordMessage("Please enter a password")
            passwordMessageRef.current.style.color = "red"
            return
        }

        if (!passwordConfirm){
            setPasswordMessage("Please confirm password")
            passwordMessageRef.current.style.color = "red"
            return
        }

        //check that passwords match

        if (password !== passwordConfirm){
            setPasswordMessage("passwords do not match")
            passwordMessageRef.current.style.color = "red"
            
            return
        }

        //send signup information to server
        try {
            const response = await axios.post(`${backendUrl}/melody-mastermind/api/account/signup`, {username, email, password})
            console.log(response);
            //TODO redirect to login page
            console.log("about to login page");

            navigateTo("/")
            console.log("navigating to login page")

        }catch(err){
            setUsernameMessage("something went wrong with the signup....")
            usernameMessageRef.current.style.color = "red"
            console.log(err)
        }

        console.log("signup complete");
        <Navigate to="/melody-mastermind/"/>
    }

    async function handleUsernameChange(e) {
        const username = e.target.value
        setUsername(username)

        //check if username is available
        const isAvailable = await checkUsernameAvailable(username)

        //display message
        if (isAvailable) {
            setUsernameMessage("Username available!")
            usernameMessageRef.current.style.color = "green"
        }
        else {
            setUsernameMessage("username already taken. Please choose another")
            usernameMessageRef.current.style.color = "red"
        }
    }

    async function handlePasswordChange(e) {
        const password = e.target.value
        console.log(password)
        setPassword(password)
    }

    async function handlePasswordConfirmChange(e) {
        const passwordConfirm = e.target.value
        console.log(passwordConfirm)
        setPasswordConfirm(passwordConfirm)
    }

    async function handleEmailChange(e) {
        const email = e.target.value
        console.log(email)
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
            <h1 className="signup__heading">Create Account</h1>

            <form className="signup__form" onSubmit={handleSignup}>
                <span className="create-account__message" ref={usernameMessageRef}>{usernameMessage}</span>
                <label htmlFor="signup__username" className="signup__label">Username</label>
                <input onChange={handleUsernameChange} value={username} type="text" id="signup__username" className="signup__username" placeholder="choose username" />

                <span className="create-account__message" ref={emailMessageRef}>{emailMessage}</span>
                <label htmlFor="signup__email" className="signup__label">Email</label>
                <input onChange={handleEmailChange} value={email} type="text" id="signup__email" className="signup__email" placeholder="Email" />


                <span className="create-account__message" ref={passwordMessageRef}>{passwordMessage}</span>
                <label htmlFor="signup__password" className="signup__label">Password</label>
                <input onChange={handlePasswordChange} value={password} type="password" id="signup__password" className="signup__password" placeholder="choose password" />

                <label htmlFor="signup__password--confirm" className="signup__label">Confirm Password</label>
                <input onChange={handlePasswordConfirmChange} value={passwordConfirm} type="password" id="signup-password--confirm" className="signup__password signup__password--confirm" placeholder="confirm password" />

                <button className="signup__button">Create Account</button>


            </form>
        </section>
    )
}