import "./Dashboard.css";
import * as React from "react";
import { Link } from "react-router-dom";
import background from "../Images/Background.png";
// import journey from "../Images/Journey.png";


export default function Dashboard(props) {

    return (
        <div className="background"
            style={{
                backgroundImage: `url(${background})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: 'cover',
                width: '100vw',
                height: '100vh'
            }}>
                <Link to='/' id="backButton" style={{textDecoration: 'none', color: 'white', border: '2px solid white' , borderRadius: '5px', width: '200px', marginRight: '90%'}}>Back To Home</Link>
            <div className="Home">
                <div className="header">
                    <p>Welcome {props.username.toUpperCase()}</p>
                </div>
            </div>
        </div>
    )

}