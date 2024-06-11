import React, { useContext, useEffect } from 'react'
import { UserContext } from '../context/userContext'
import {Navigate} from 'react-router-dom'

const PrivateRoute = ({children}) => {
    const {isLoggedIn} = useContext(UserContext);
    
    if(!isLoggedIn) return <Navigate to='/login'/>
    else return children;
}

export default PrivateRoute