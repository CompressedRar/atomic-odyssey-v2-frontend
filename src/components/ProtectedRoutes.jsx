import {UseAuth} from "../components/Auth"
import { Navigate } from "react-router-dom"

function ProtectedRoute({children}){

    const {user, loading} = UseAuth()
    console.log(UseAuth())
    if(loading) return "Loading"
    if(!user) {
        return <Navigate to = "/" replace />
    }

    return children
}

export default ProtectedRoute