import React, { useState, useContext } from 'react'
import { UserListContext } from './UserStateProvider'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


function UserCreation() {
    const [newUserFormData, setNewUserFormData] = useState({ email: "", password: "" })
    const [userExists, setUserExists] = useState(false)
    const {userList, setUserList} = useContext(UserListContext)
    const navigate = useNavigate()

    function checkEmailExists() {
        userList.forEach(user => {
            if (user.email === newUserFormData.email) {
                setUserExists(true)
            }
        })
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
        checkEmailExists()

        if (!userExists) {
            axios.post(apiUrl, newUserFormData)
                .then(response => {
                    setUserList(prevList => [...prevList, response.data])
                    setUserExists(false)
                    navigate("user-page")
                })
                .catch(error => {
                    console.error("Error creating user:", error)
                })
        } else {
              console.log("user already exists")
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    name="email"
                    onChange={handleChange}
                    placeholder="Email Address"
                    type="email"
                    value={newUserFormData.email}
                />
                <input
                    name="password"
                    onChange={handleChange}
                    placeholder="Password"
                    type="password"
                    value={newUserFormData.password}
                />
                <button type="submit">Create user</button>
            </form>
        </div>
    )
}

export default UserCreation