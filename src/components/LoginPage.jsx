import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserListContext } from './UserStateProvider'


function LoginPage() {
    const [loginFormData, setLoginFormData] = useState({ email: "", password: "" })
    const {userList} = useContext(UserListContext)
    const [emailMatchesPassword, setEmailMatchesPassword] = useState(false)
    const [wrongCredentials, setWrongCredentials] = useState(false)
    const navigate = useNavigate() // hook pra mudar a página pra o path escolhido

    const wrongCredentialsMessage = wrongCredentials? "WRONG CREDENTIALS" : ""

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

    function checkEmail() {
        userList.forEach(user => {
            if (user.email === loginFormData.email && user.password === loginFormData.password) {
                setEmailMatchesPassword(true)
            } 
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        checkEmail()
        if (emailMatchesPassword) {
            navigate("user-page")
            setEmailMatchesPassword(false)
        } else{
            setWrongCredentials(true)
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
                value={loginFormData.email}
            />
            <input
                name="password"
                onChange={handleChange}
                placeholder="Password"
                type="password"
                value={loginFormData.password}
            />
            <button type="submit">Log in</button>
            <Link to="/create">Sign Up</Link>
        </form>
        {wrongCredentialsMessage}
    </div>
  )
}

export default LoginPage