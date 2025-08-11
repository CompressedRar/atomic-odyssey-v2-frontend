import { useState } from "react";
import {auth} from '../configs/FirebaseConfig'
import { createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import '../styles/Login.css'

function SignUpPage(){
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [error , setError] = useState("")

    const handleSignIn = async (e) =>{
        e.preventDefault()
        console.log(e)
        try {
            var userCredentials = await createUserWithEmailAndPassword(auth ,email, password)
            console.log(userCredentials.user.uid)

            await sendEmailVerification(userCredentials.user)
            alert("Email Verification Sent")
        }
        catch(error){
            setError(error.message)
        }
    } 

    

    return (
        <div>
            Sign In
            <form action="" onSubmit={handleSignIn} className="account-form">
                <div className="textbox">
                    <span>Email</span>
                    <input type="email" name = "email" placeholder="Eg. johndoe@gmail.com" required onChange={(element)=>{setEmail(element.target.value)}}/>
                </div>
                <div className="textbox">
                    <span>Password</span>
                    <input type="password" name = "password" placeholder="8 characters or longer...." required onChange={(element)=>{setPassword(element.target.value)}}/>
                </div>
                <button>Sign Up</button>
                {error}
            </form> 
        </div>
    )
    
}


export default SignUpPage