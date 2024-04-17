import React, { useState, useContext } from 'react'
import { UserListContext } from './UserStateProvider'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


function UserCreation() {
    const [newUserFormData, setNewUserFormData] = useState({ email: "", password: "" })
    const {userList, setUserList} = useContext(UserListContext)
    const [error, setError] = useState(false)
    const errorMessage = error? "Email already exists or invalid email" : ""
    const navigate = useNavigate()

    function emailExists() { // checa se o email existe no banco de dados
        let exists = false

        userList.forEach(user => {
            if (user.email === newUserFormData.email) {
                exists = true
            }
        })

        return exists
    }

    function handleChange(e) {
        const { name, value } = e.target

        setNewUserFormData(prev => ({
          ...prev,
            [name]: value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()

        const apiUrl = "http://127.0.0.1:8000/api/users/create/"

        if (newUserFormData.email !== "" && emailExists() === false) {
            axios.post(apiUrl, newUserFormData)
                .then(response => {
                    setUserList(prevList => [...prevList, response.data])
                })
                .catch(error => {
                    console.error("Error creating user:", error)
                })
            setError(false)
            navigate("/user-page")
        } else {
            setError(true)
            
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <p className="error-message">{errorMessage}</p>
                <label htmlFor="email">Username:</label>
                <input
                    name="email"
                    onChange={handleChange}
                    placeholder="Email Address"
                    type="email"
                    value={newUserFormData.email}
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