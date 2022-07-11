import "./Dashboard.css";
import * as React from "react";
import { Link } from "react-router-dom";
import background from "../Images/Background.png";
import axios from "axios"
// import journey from "../Images/Journey.png";


export default function Dashboard(props) {
    const PORT = 3001
    const response = () => {
      axios.post(`http://localhost:${PORT}/users/dashboard`, {
        sessionToken : props.sessionToken
    })

    .then(function(response) {
      console.log("hi: " + response.data.sessionToken)
    //   props.handleSessionToken(response.data.sessionToken)
    //   props.handleUsername(document.getElementById('username').value);
    })

    .catch(function(error) {
        console.log(error)
    //   props.handleSignInErrorMessage("Sign in failed: " + error.response.data.error);
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
                <Link to='/' onClick={response} id="logOut" style={{textDecoration: 'none', color: 'white', border: '2px solid white' , borderRadius: '5px', width: '200px', marginRight: '90%'}}>Log Out</Link>
            <div className="Home">
                <div className="Header">
                    <p>Welcome {props.username.toUpperCase()}</p>
                    <hr id="DashDivide"/>
                </div>
                <div className="Dash">
                    <p style={{paddingLeft:'10px', height: '20px', width: '100px'}}>Current Trips:</p>
                    <Link to= '/users/trip' id="NewTrip"style={{marginLeft:'100px', textDecoration: 'none', color: 'white', border: '2px solid white' , borderRadius: '5px', height: '20px', width: '200px', marginTop: '34%'}}>New Trip</Link>
                    <hr id="TripsDivide"/>
                    <p style={{paddingRight:'42%', height: '20px', width: '100px'}}>Past Trips:</p>
                </div>
            </div>
        </div>
    )

}