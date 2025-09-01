import {auth} from "../configs/FirebaseConfig"
import { useEffect, useState, useContext, createContext } from "react";
import { onAuthStateChanged,} from "firebase/auth";

const AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (FirebaseUser)=>{
            setLoading(false)
            setUser(FirebaseUser)
        })

        return ()=> unsubscribe()
    }, [auth])

   
    return (    
        <AuthContext.Provider value = {{user, loading}}>
            {children}
        </AuthContext.Provider>
    )
    
}

export function UseAuth(){
    const cntxt = useContext(AuthContext)
    console.log(cntxt)
    return cntxt
}

