import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import UserCreation from './components/UserCreation'
import UserStateProvider from './components/UserStateProvider'
import UserPage from './components/UserPage'
import './index.css'


function App() {
    

  return (
    <BrowserRouter>
        <UserStateProvider>
            <Routes>
                <Route path="/" element={<LoginPage />}/>
                <Route path="create" element={<UserCreation />} />
            </Routes>
        </UserStateProvider>
        <Routes>
            <Route path="user-page" element={<UserPage />}/>
        </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
