import { useState } from "react";
import {auth} from '../configs/FirebaseConfig'
import { createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import '../styles/Login.css'
import '../styles/SignUp.css'
import MessageError from '../components/CustomAlerts.js'
import axios from "axios"


function SignUpPage(){
    const [username , setUsername] = useState("")
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [confrimPassword , setConfirmPassword] = useState("")
    const [error , setError] = useState("")
    const [showPassword, setShowPassword] = useState("password")
    const [profile, setProfile] = useState(null)


    //make sure the yung password ay laging 8 characters
    const handleSignIn = async (e) =>{
        e.preventDefault()
        try {
            console.log("signing in")
            var userCredentials = await createUserWithEmailAndPassword(auth ,email, password)
            //console.log(userCredentials.user.uid)
            
            var res = await handleServerCall(userCredentials.user.uid);
            
            
        }
        catch(error){
            setError(error.message)
            console.log(error.message)
            MessageError("Email address was already taken.")
        }
    } 

    const handleServerCall = async (uuid) =>{
        const formData = new FormData()

        if(username == null || username == ""){
            MessageError("Username must not be empty.")
        }
        if(email == null || username == ""){
            MessageError("Email must not be empty.")
        }
        if(profile == null){
            MessageError("File must not be empty.")
        }

        formData.append("username", username)
        formData.append("uuid", uuid)
        formData.append("file", profile)

        try {
            console.log("SENDING DATA")
            const result = await axios.post("http://127.0.0.1:5000/api/auth/test-user-create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                } 
            })
            console.log(result)
        }
        catch(exception){
            console.log(exception)
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
                            <h1>Register to</h1>
                            <h1 id="title">Atomic Odyssey</h1>
                        </div>
                        
                        <div className="textbox profile-container">
                            <span>Profile Picture</span>
                            <input type="file" name = "profile-picture" id = "profile-picture" onChange={(e)=>{setProfile(e.target.files[0])}} accept="image/*"/>
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
                            <input type={showPassword} name = "password" placeholder="8 characters or more...."
                            required onChange={(element)=>{setPassword(element.target.value)}}
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            title="Password must be at least 8 characters long, include uppercase, lowercase, number, and special character."/>
                        </div>
                        <div className="textbox">
                            <span>Confirm Password</span>
                            <input type={showPassword} name = "password" placeholder="8 characters or more...." required onChange={(element)=>{setPassword(element.target.value)}}
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            title="Password must be at least 8 characters long, include uppercase, lowercase, number, and special character."/>
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