
import "./Home.css";
import * as React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="Home">
        <p>Welcome to your Journey!</p>
        <Link to='/users/register' style={{textDecoration: 'none' }}>
        <p className="SignUp">Sign Up</p>
        </Link>
        <Link to='/users/login' style={{textDecoration: 'none' }}>
            <p className="SignUp">Sign in</p>
        </Link>
        </div>
    )

}
