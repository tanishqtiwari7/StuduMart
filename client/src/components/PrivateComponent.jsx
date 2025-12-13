import React from 'react'
import useAuthStatus from '../hooks/useAuthStatus'
import Loader from './Loader'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateComponent = () => {

    const { userExist, checkingUser } = useAuthStatus()

    if (checkingUser) {
        return (
            <Loader />
        )
    }

    return userExist ? <Outlet /> : <Navigate to={"/login"} />
}

export default PrivateComponent
