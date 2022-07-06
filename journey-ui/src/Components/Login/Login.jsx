import "./Login.css";
import * as React from "react";
import { Link } from "react-router-dom";
import axios from "axios"

export default function Login(){
    const PORT = 3001
    const response = () => {
      axios.post(`http://localhost:${PORT}/users/login`, {
      username : document.getElementById('username').value,
      password : document.getElementById('password').value,
    })

    .then(function(response) {
      console.log(response)
    })

    .catch(function(error) {
      console.log(error)
    })
    }
    return (
      <div className = "Login">
        <input id="username" placeholder="Username..." input="text"/>
        <input id="password" placeholder="Password..." input="text"/>
        <button onClick={response}>Sign in</button>
        <Link to='/' style={{textDecoration: 'none' }}>
        <p className="BackButton">Back To Home</p>
        </Link>
      </div>
    );
    // return(
    //     <div className="login">
    //         <p>Login</p>
    //     </div>
    // )
}
