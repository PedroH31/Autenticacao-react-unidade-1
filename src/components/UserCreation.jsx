import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})


function UserCreation() {
    const [newUserFormData, setNewUserFormData] = useState({ 
        email: "", 
        username: "", 
        password: "" 
    })
    const [currentUser, setCurrentUser] = useState(false)
    const [error, setError] = useState(false)
    const errorMessage = error? "Email already exists or invalid email" : ""
    const navigate = useNavigate()



    function handleChange(e) {
        const { name, value } = e.target

        setNewUserFormData(prev => ({
          ...prev,
            [name]: value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        try {
            client.post("/api/register/",
                {
                    email: newUserFormData.email,
                    username: newUserFormData.username,
                    password: newUserFormData.password
                }
            ).then((res) => {
                client.post(
                    "/api/login/",
                    {
                        email: newUserFormData.email,
                        password: newUserFormData.password
                    }
                )
            }).then(res => {
                setCurrentUser(true)
                setError(false)
                navigate("/user-page")
            })
        } catch (error) {
            console.error("could not log in", error)
            setError(true)
        }
        
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <p className="error-message">{errorMessage}</p>
                <label htmlFor="email">Email:</label>
                    <input
                        name="email"
                        onChange={handleChange}
                        placeholder="Email Address"
                        type="email"
                        value={newUserFormData.email}
                    />
                <label htmlFor="username">Username:</label>
                    <input
                        name="username"
                        onChange={handleChange}
                        placeholder="Username"
                        value={newUserFormData.username}
                    />
                <label htmlFor="password">Password:</label>
                    <input
                        name="password"
                        onChange={handleChange}
                        placeholder="Password"
                        type="password"
                        value={newUserFormData.password}
                    />
                <button type="submit" className="form-button">Create user</button>
            </form>
        </div>
    )
}

export default UserCreation