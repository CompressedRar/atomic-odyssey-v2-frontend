import { useState } from "react";
import {auth} from '../configs/FirebaseConfig'
import { signInWithEmailAndPassword } from "firebase/auth";
import '../styles/App.css';
import '../styles/Login.css';
import MessageError from '../components/CustomAlerts.js'

function LoginPage(){
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [error , setError] = useState("")

    const handleSignIn = async (e) =>{
        e.preventDefault()
        console.log(e)
        try {
            var userCredentials = await signInWithEmailAndPassword(auth ,email, password)
            if (userCredentials.user.emailVerified){
                MessageError("Test")
            }
            else {
                MessageError("Test")
            }
        }
        catch(error){
            MessageError("The username or password is incorrect.")
        }
    } 

    return (
        <div id="main-wrapper">
            
            <div className="login-container">
                
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
                        <input type="password" name = "password" placeholder="Password" required onChange={(element)=>{setPassword(element.target.value)}}/>
                    </div>
                    <div className="login-options">
                        <div className="remember-container">
                            <input type="checkbox" name="remember" id="remember" />
                            <label htmlFor="remember">Show Password</label>
                        </div>
                        <div className="forgot-container">
                            <a href="">Forgot Password</a>
                        </div>

                    </div>
                    <button>Login</button>
                    {error}
                </form> 
            </div>

            
        </div>
    )
    
}


export default LoginPage