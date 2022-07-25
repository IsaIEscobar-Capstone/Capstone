import "./Login.css";
import * as React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router';
import axios from "axios"

import background from "../Images/Background.png";
import journey from "../Images/JourneyStraight.png";

export default function Login(props) {
  let navigate = useNavigate();
  const PORT = 3001

  const response = () => {
    props.handleSignInErrorMessage("");
    axios.post(`http://localhost:${PORT}/users/login`, {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
    })

      .then(function (response) {
        console.log("hi: " + response.data.sessionToken)
        props.handleSessionToken(response.data.sessionToken)
        props.handleUsername(document.getElementById('username').value);
        props.handleCurrentTripList(response.data.trips)
        navigate("/users/dashboard")
        console.log(props.username)
      })
      .catch(function (error) {
        props.handleSignInErrorMessage("Sign in failed: " + error.response.data);
      })
  }

  return (
    <div className="background"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: 'cover',
        width: '100vw',
        height: '100vh'
      }}>
      <Link to='/' id="backButton" onClick={() => props.handleSignInErrorMessage("")} style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', width: '200px', marginRight: '90%' }}>Back To Home</Link>
      <div className="Login">
        <img id="logo" src={journey} height='400px' alt='logo' />
        <section>
          <input id="username" placeholder="Username..." type="text" />
        </section>
        <section>
          <input id="password" placeholder="Password..." type="password" />
        </section>
        <section>
          <button id="signIn" onClick={response}>Sign in</button>
          <p style={{ color: 'red' }}>{props.signInErrorMessage}</p>
        </section>
      </div>
    </div>
  );
}
