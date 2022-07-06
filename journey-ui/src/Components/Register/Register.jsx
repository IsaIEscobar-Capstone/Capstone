import './Register.css';
import axios from "axios"
import { Link } from "react-router-dom";

import background from "../Images/Background.png";
import journey from "../Images/JourneyStraight.png";

export default function Register(props){
    const PORT = 3001
    const response = () => {
      props.handleSignUpErrorMessage("");
      axios.post(`http://localhost:${PORT}/users/register`, {
      email : document.getElementById('email').value,
      username : document.getElementById('username').value,
      password : document.getElementById('password').value,
    })

    .then(function(response) {
      console.log(response)
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
        <img id="logo" src={journey} height='300px'/>
        <section>
        <input id="email" placeholder="Email..." input="text"/>
        </section>
        <section>
        <input id="username" placeholder="Username..." input="text"/>
        </section>
        <section>
        <input id="password" placeholder="Password..." input="text"/>
        </section>
        <section>
        <button id="signUp" onClick={response}>Sign up</button>
        <p style={{color: 'red'}}>{props.signUpErrorMessage}</p>
        </section>
      </div>
      </div>
    );
}
