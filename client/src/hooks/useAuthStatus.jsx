import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const useAuthStatus = () => {

    const { user } = useSelector(state => state.auth)

    const [userExist, setUserExist] = useState(false)
    const [checkingUser, setCheckingUser] = useState(true)

    useEffect(() => {
        user ? setUserExist(true) : setUserExist(false)
        setCheckingUser(false)
    }, [user])

    return { userExist, checkingUser }

}


export default useAuthStatus