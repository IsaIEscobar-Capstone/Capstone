
import "./Home.css";
import * as React from "react";
import { Link } from "react-router-dom";
import background from "../Images/Background.png";
import journey from "../Images/Journey.png";


export default function Home() {
    return (
        <div className="background"
            style={{
                backgroundImage: `url(${background})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: 'cover',
                width: '100vw',
                height: '100vh'
            }}>
            <div className="Home">
                <div className="header-main">
                    <p>Welcome to your</p>
                    <img id="logo" src={journey} width="250" height="200" />
                </div>
                <div className="buttons">
                    <Link to='/users/register' style={{textDecoration: 'none', color: 'white', border: '2px solid white' , borderRadius: '10px', width: '150px'}}>
                        <p className="SignUp">Sign Up</p>
                    </Link>

                    <Link to='/users/login' style={{textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '10px' , width: '150px'}}>
                        <p className="SignUp">Sign in</p>
                    </Link>
                </div>
            </div>
        </div>
    )

}
