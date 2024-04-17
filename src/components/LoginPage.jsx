import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserListContext } from './UserStateProvider'
import axios from 'axios'


function LoginPage() {
    const [loginFormData, setLoginFormData] = useState({ email: "", password: "" })
    const {userList} = useContext(UserListContext)
    const [wrongCredentials, setWrongCredentials] = useState(false)
    const navigate = useNavigate() // hook pra mudar a página pra o path escolhido

    const wrongCredentialsMessage = loginFormData.email === "" || 
        loginFormData.password === ""? "Please enter your credentials"
        : "Wrong Email or Password"


    function handleChange(e) {
        const { name, value } = e.target
        setLoginFormData(prev => ({
          ...prev,
          [name]: value
        }))
    }

    useEffect(() => {
        console.log(userList)
    }, [userList])

    /* function emailMatchesPassword() {
        let emailMatches = false

        userList.forEach(user => {
            if (user.email === loginFormData.email && user.password === loginFormData.password) {
                emailMatches = true
            } 
        })

        return emailMatches
    } */

    async function handleSubmit(e) {
        e.preventDefault()

        const apiUrl = "http://127.0.0.1:8000/api/login/"

        try {
            const response = await axios.post(apiUrl, loginFormData)
            console.log("Login successful:", response.data)
            navigate("/user-page")
        } catch (error) {
            console.error("Login failed:", error)
            setWrongCredentials(true) 
        }

    }

  return (
    <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
            <p className="error-message">{wrongCredentials && wrongCredentialsMessage}</p>
            <label htmlFor="email">Username:</label>
            <input
                name="email"
                onChange={handleChange}
                placeholder="Email Address"
                type="email"
                value={loginFormData.email}
            />
            <label htmlFor="password">Password:</label>
            <input
                name="password"
                onChange={handleChange}
                placeholder="Password"
                type="password"
                value={loginFormData.password}
            />
            <button type="submit" className="form-button">Log in</button>
            <div className="login-options">
                <Link to="/create">Sign up</Link>
            </div>
        </form>
    </div>
  )
}

export default LoginPage