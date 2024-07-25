import React, { useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client from '../client'


function LoginPage() {
    const [loginFormData, setLoginFormData] = useState({ email: "", password: "" })
    const [wrongCredentials, setWrongCredentials] = useState(false)
    const navigate = useNavigate() 

    const wrongCredentialsMessage = loginFormData.email === "" || 
        loginFormData.password === "" ? "Please enter your credentials"
        : "Wrong Email or Password"


    function handleChange(e) {
        const { name, value } = e.target
        setLoginFormData(prev => ({
          ...prev,
          [name]: value
        }))
    }


    function handleSubmit(e) {
        e.preventDefault();
    
        client.post('/api/login/', loginFormData)
            .then(res => {
                localStorage.setItem('userId', res.data.user_id)
                setWrongCredentials(false);
                navigate('/user-page')
            })
            .catch(error => {
                console.error('Login error:', error);
                setWrongCredentials(true)
            })
        
    }


  return (
    <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
            <p className="error-message">{wrongCredentials && wrongCredentialsMessage}</p>
            <label htmlFor="email">Email:</label>
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