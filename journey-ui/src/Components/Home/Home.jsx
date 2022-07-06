
import "./Home.css";
import * as React from "react";
import { Link } from "react-router-dom";

export default function Home(props) {
    return (
        <div className="Home">
        <p>Welcome to your Journey!</p>
        <Link to='/user/register' style={{textDecoration: 'none' }}>
        <p className="SignUp">Sign Up</p>
        </Link>
        </div>
    )

}
