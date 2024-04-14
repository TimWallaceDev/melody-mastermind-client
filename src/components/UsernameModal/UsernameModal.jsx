import { useRef, useState, useEffect } from "react"
import "./UsernameModal.scss"
import axios from 'axios'
import logo from "../../assets/MMlogo.png"

export function UsernameModal() {

    const [username, setUsername] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const modalRef = useRef()
    const messageRef = useRef()

    useEffect(() => {
        function checkForUsername() {
            const usernameCheck = localStorage.getItem("username")
            if (usernameCheck) {
                console.log("user has name")
                //hide Modal
                modalRef.current.style.display = "none"
            }
        }
        checkForUsername()
    }, [])

    async function checkUsernameAvailable(username) {
        try {
            const response = await axios.post("http://localhost:8080/users/check", { username: username })
            const available = response.data.username_available
            return available ? true : false
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async function handleChange(e) {
        const username = e.target.value
        setUsername(username)

        //check if username is available
        const isAvailable = await checkUsernameAvailable(username)

        //display message
        if (isAvailable) {
            setErrorMessage("Username available!")
            messageRef.current.style.color = "green"
        }
        else {
            setErrorMessage("username already taken. Please choose another")
            messageRef.current.style.color = "red"
        }
    }

    async function handleUsername() {
        console.log("registering as ", username)
        //make sure username has a least one character
        if (!username) {
            setErrorMessage("Please enter a username")
            messageRef.current.style.color = "red"
            return
        }
        //check username availability
        const available = await checkUsernameAvailable(username)
        let userId
        //if available, create user
        if (available) {
            try {
                const response = await axios.post("http://localhost:8080/users", { username })
                userId = response.data[0]
            } catch (err) {
                console.log(err)
            }
        }
        else {
            setErrorMessage("username is taken")
            messageRef.current.style.color = "red"
            return
        }

        //set username in localstorage
        console.log("userId: ", userId)
        localStorage.setItem("username", username)
        localStorage.setItem("userId", userId)

        //close modal
        modalRef.current.style.display = "none";
    }

    return (
        <section className="username-modal__wrapper" ref={modalRef}>
            <div className="username-modal">
                <div className="username-modal__brand">
                    <img src={logo} alt="" className="username-modal__logo" />
                    <h1 className="username-modal__name">Melody <br></br> MasterMind</h1>
                </div>
                <h2 className="username-modal__heading">Choose A Username</h2>
                <span className="username-modal__message" ref={messageRef}>{errorMessage}</span>
                <label className="username-modal__label">Username</label>
                <input className="username-modal__input" type="text" placeholder="Username" onChange={handleChange} value={username}></input>
                <button className="username-modal__submit" onClick={handleUsername} >Choose Username</button>
            </div>
        </section>
    )
}