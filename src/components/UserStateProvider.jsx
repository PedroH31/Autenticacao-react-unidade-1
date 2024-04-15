import React, {useState, createContext, useEffect} from 'react'
import axios from 'axios'

export const UserListContext = createContext(null)

function UserStateProvider({children}){
    const [userList, setUserList] = useState([])

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/users/")
            .then(response => {
                setUserList(response.data)
            })
            .catch(error => {
                console.error("Error fetching data:", error)
            })
    }, [])

    return (
        <UserListContext.Provider value={{userList, setUserList}}>
            {children}
        </UserListContext.Provider>
    )
}

export default UserStateProvider