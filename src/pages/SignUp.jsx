import { useState } from "react";
import {auth} from '../configs/FirebaseConfig'
import { createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import '../styles/Login.css'
import '../styles/SignUp.css'
import msg from '../components/CustomAlerts.js'
import axios from "axios"
import '../styles/animations.css'
import BackgroundVideo from "../components/BackgroundVideo.jsx";
function SignUpPage(){
    const [username , setUsername] = useState("")
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [confrimPassword , setConfirmPassword] = useState("")
    const [error , setError] = useState("")
    const [showPassword, setShowPassword] = useState("password")
    const [profile, setProfile] = useState(null)
    const [profileBoxText, setProfileBoxText] = useState("Add Image")
    const [preview, setPreview] = useState(null) 

    const [isLoading, setLoading] = useState("none")
    //make sure the yung password ay laging 8 characters
    const handleSignIn = async (e) =>{
        e.preventDefault()
        try {
            console.log("Validating Input")
            if(username == null || username == ""){
                msg.Error("Username must not be empty.")
                return
            }

            if(email == null || username == ""){
                msg.Error("Email must not be empty.")
                return
            }

            if(profile == null){
                msg.Error("Profile must not be empty.")
                return
            }

            if(password != confrimPassword){
                console.log(password + " " + confrimPassword)
                msg.Error("Passwords must match.")
                return
            }

            setLoading("flex")
            var userCredentials = await createUserWithEmailAndPassword(auth ,email, password)
            var res = await handleServerCall(userCredentials.user.uid);
            setLoading("none")
            //if successful

            
            
            
        }
        catch(error){
            setError(error.message)
            setLoading("none")
            console.log(error.message)
            msg.Error("Email address was already taken.")
        }
    } 

    const handleServerCall = async (uuid) =>{
        const formData = new FormData()
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
            msg.Success(result["data"]['message'])

            setConfirmPassword("")
            setEmail("")
            setPassword("")
            setProfile(null)
            setProfileBoxText("Add Image")
            setUsername("")
            setPreview(null)

            
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

    const handleProfilePicture = (e) => {
        var newfile = e.target.files[0]
        if (newfile){
            setProfile(newfile)
            setPreview(URL.createObjectURL(newfile))
            setProfileBoxText("")
        }
        else {
            setProfileBoxText("Upload Image")
        }
        

    }


    return (
        <div id="main-wrapper" className="sign-wrapper">
            <div className="loading-screen" style={{display: isLoading}}>
                <span className="material-symbols-outlined" id="loading-icon" >
                    progress_activity
                </span>
                <label htmlFor="">Processing</label>
            </div>
            
            <BackgroundVideo></BackgroundVideo>
            <div className="login-container">
                
                <div className="login-form-container">
                    <form action="" onSubmit={handleSignIn} className="login-form">
                        <div className="title-container">
                            <h1>Register to</h1>
                            <h1 id="title">Atomic Odyssey</h1>
                        </div>
                        
                        <div className="textbox profile-container">
                            <span>Profile Picture</span>
                            <input type="file" name = "profile-picture" id = "profile-picture" onChange={handleProfilePicture} accept="image/*" hidden/>
                            <label htmlFor="profile-picture" className="profile-button">
                                
                                    {profileBoxText}
                                    <img src = {preview} alt="" id="profile-image-container" />
                               
                            </label>
                        </div>
                        <div className="textbox">
                            <span>Username</span>
                            <input type="text" name = "email" placeholder="John Doe" required onChange={(element)=>{setUsername(element.target.value)}} value={username}/>
                        </div>
                        <div className="textbox">
                            <span>Email</span>
                            <input type="email" name = "email" placeholder="johndoe@gmail.com" required onChange={(element)=>{setEmail(element.target.value)}} value={email}/>
                        </div>
                        <div className="textbox">
                            <span>Password</span>
                            <input type={showPassword} name = "password" placeholder="8 characters or more...." value={password}
                            required onChange={(element)=>{setPassword(element.target.value)}}
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            title="Password must be at least 8 characters long, include uppercase, lowercase, number, and special character."/>
                        </div>
                        <div className="textbox">
                            <span>Confirm Password</span>
                            <input type={showPassword} name = "password" placeholder="8 characters or more...." required value={confrimPassword} 
                            onChange={(element)=>{setConfirmPassword(element.target.value)}}
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            title="Password must be at least 8 characters long, include uppercase, lowercase, number, and special character."/>
                        </div>
                        <div className="login-options">
                            <div className="remember-container">
                                <input type="checkbox" name="remember" id="remember" />
                                <label htmlFor="remember"  onClick={()=>{toggleShowPassword()}}>Show Password</label>
                            </div>

                        </div>
                        <button id="login-button">Register</button>
                        
                    </form> 
                    <span id="new-account-link">Already have an account?<a href="/">Click here.</a></span>
                </div>

                
            </div>

            
        </div>
    )
    
}


export default SignUpPage