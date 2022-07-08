import './Register.css';
import axios from "axios"
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router';

import background from "../Images/Background.png";
import journey from "../Images/JourneyStraight.png";

export default function Register(props){
    let navigate = useNavigate();
    const PORT = 3001
    const response = () => {
      props.handleSignUpErrorMessage("");
      axios.post(`http://localhost:${PORT}/users/register`, {
      email : document.getElementById('email').value,
      username : document.getElementById('username').value,
      password : document.getElementById('password').value,
    })

    .then(function(response) {
      console.log("hi register: " + response.data.sessionToken)
      props.handleSessionToken(response.data.sessionToken)
      props.handleUsername(document.getElementById('username').value);
      navigate("/users/dashboard")
      console.log(props.username)
    })

    .catch(function(error) {
      props.handleSignUpErrorMessage("Sign up failed: " + error.response.data.loginMessage);
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
      <Link to='/' id="backButton" onClick={()=> props.handleSignInErrorMessage("")} style={{textDecoration: 'none', color: 'white', border: '2px solid white' , borderRadius: '5px', width: '200px', marginRight: '90%'}}>Back To Home</Link>
      <div className = "Login">
        <img id="logo" src={journey} height='300px' alt='logo'/>
        <section>
        <input id="email" placeholder="Email..." type="text"/>
        </section>
        <section>
        <input id="username" placeholder="Username..." type="text"/>
        </section>
        <section>
        <input id="password" placeholder="Password..." type="password"/>
        </section>
        <section>
        <button id="signUp" onClick={response}>Sign up</button>
        <p style={{color: 'red'}}>{props.signUpErrorMessage}</p>
        </section>
      </div>
      </div>
    );
}
