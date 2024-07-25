import React, {useState, createContext, useEffect} from 'react'
import axios from 'axios'

export const UserListContext = createContext(null)

function UserStateProvider({children}){


    return (
        <UserListContext.Provider>
            {children}
        </UserListContext.Provider>
    )
}

export default UserStateProvider        