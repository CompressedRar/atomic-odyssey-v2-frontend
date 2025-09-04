import { useState } from "react";
import {auth} from '../configs/FirebaseConfig'
import { signInWithEmailAndPassword } from "firebase/auth";
import '../styles/App.css';
import '../styles/Login.css';
import msg from '../components/CustomAlerts.js'
import { Navigate } from "react-router-dom";
import BackgroundVideo from "../components/BackgroundVideo.jsx";

function LoginPage(){
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [error , setError] = useState("")
    const [showPassword, setShowPassword] = useState("password")


    const handleSignIn = async (e) =>{
        e.preventDefault()
        console.log(e)
        try {
            var userCredentials = await signInWithEmailAndPassword(auth ,email, password)
            //msg.Success("Correct Credentials")
            window.location.replace("/main")
            
        }
        catch(error){
            msg.Error("The username or password is incorrect.")
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
        <div id="main-wrapper" className = "login-wrapper">
            <BackgroundVideo></BackgroundVideo>
            <div className="login-container">
                
                <div className="login-form-container">
                    <form action="" onSubmit={handleSignIn} className="login-form">
                        <div className="title-container">
                            <h1>Login to</h1>
                            <h1 id="title">Atomic Odyssey</h1>
                        </div>
                        <div className="textbox">
                            <span>Email</span>
                            <input type="email" name = "email" placeholder="johndoe@gmail.com" required onChange={(element)=>{setEmail(element.target.value)}}/>
                        </div>
                        <div className="textbox">
                            <span>Password</span>
                            <input type={showPassword} name = "password" placeholder="Password" required onChange={(element)=>{setPassword(element.target.value)}}/>
                        </div>
                        <div className="login-options">
                            <div className="remember-container">
                                <input type="checkbox" name="remember" id="remember" />
                                <label htmlFor="remember" onClick={()=>{toggleShowPassword()}}>Show Password</label>
                            </div>
                            <div className="forgot-container">
                                <a href="">Forgot Password</a>
                            </div>

                        </div>
                        <button id="login-button">Login</button>
                        
                    </form> 
                    <span id="new-account-link">Don't have an account?<a href="/register">Click here.</a></span>
                </div>

                
            </div>

            
        </div>
    )
    
}


export default LoginPage