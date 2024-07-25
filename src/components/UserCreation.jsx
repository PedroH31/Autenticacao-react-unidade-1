import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../client'


function UserCreation() {
    const [newUserFormData, setNewUserFormData] = useState({ 
        email: "", 
        username: "", 
        password: "" 
    })
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
        client.post("/api/register/", newUserFormData)
            .then(() => {
                client.post("/api/login/", {
                    email: newUserFormData.email,
                    password: newUserFormData.password
                }).then(() => {
                    setError(false)
                    navigate("/user-page");
                });
            })
            .catch(() => {
                setError(true);
            });
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