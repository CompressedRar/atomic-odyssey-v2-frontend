import { useState } from "react";
import {auth} from '../configs/FirebaseConfig'
import { createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import '../styles/Login.css'
import '../styles/SignUp.css'
import MessageError from '../components/CustomAlerts.js'

function SignUpPage(){
    const [username , setUsername] = useState("")
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [confrimPassword , setConfirmPassword] = useState("")
    const [error , setError] = useState("")
    const [showPassword, setShowPassword] = useState("password")

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

    const toggleShowPassword = () => {
        console.log("test")
        if (showPassword == "password"){
            setShowPassword("text")
        }
        else {
            setShowPassword("password")
        }
    }

    return (
        <div id="main-wrapper" className="sign-wrapper">
            <div className="background-image-container">
                
            </div>
            <div className="login-container">
                
                <div className="login-form-container">
                    <form action="" onSubmit={handleSignIn} className="login-form">
                        <div className="title-container">
                            <h1>Login to</h1>
                            <h1 id="title">Atomic Odyssey</h1>
                        </div>
                        
                        <div className="textbox profile-container">
                            <span>Profile Picture</span>
                            <input type="file" name = "profile-picture" id = "profile-picture" hidden required/>
                            <label htmlFor="profile-picture" className="profile-button">
                                <span>Add Image</span>
                            </label>
                        </div>
                        <div className="textbox">
                            <span>Username</span>
                            <input type="text" name = "email" placeholder="John Doe" required onChange={(element)=>{setUsername(element.target.value)}}/>
                        </div>
                        <div className="textbox">
                            <span>Email</span>
                            <input type="email" name = "email" placeholder="johndoe@gmail.com" required onChange={(element)=>{setEmail(element.target.value)}}/>
                        </div>
                        <div className="textbox">
                            <span>Password</span>
                            <input type={showPassword} name = "password" placeholder="8 characters or more...." required onChange={(element)=>{setPassword(element.target.value)}}/>
                        </div>
                        <div className="textbox">
                            <span>Confirm Password</span>
                            <input type={showPassword} name = "password" placeholder="8 characters or more...." required onChange={(element)=>{setPassword(element.target.value)}}/>
                        </div>
                        <div className="login-options">
                            <div className="remember-container">
                                <input type="checkbox" name="remember" id="remember" />
                                <label htmlFor="remember"  onClick={()=>{toggleShowPassword()}}>Show Password</label>
                            </div>

                        </div>
                        <button id="login-button">Login</button>
                        
                    </form> 
                    <span id="new-account-link">Already have an account?<a href="/">Click here.</a></span>
                </div>

                
            </div>

            
        </div>
    )
    
}


export default SignUpPage