import {auth} from "../configs/FirebaseConfig"
import { signOut } from "firebase/auth"

export function Logout() {
    return signOut(auth).then(() => {
        try {
            console.log("User Logout Successfully")
        }
        catch(exception){
            console.error("Error in Logging out", error)
        }
    })
}