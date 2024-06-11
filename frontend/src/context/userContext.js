import {createContext, useState, useEffect} from 'react';

export const UserContext = createContext({});

export function UserContextProvider({children}){
    const[isLoggedIn, setIsLoggedIn] = useState(false);

    const value = {
        isLoggedIn, setIsLoggedIn
    }
    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}