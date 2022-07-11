import "./Trip.css";
import * as React from "react";
import background from "../Images/Background.png";

export default function Trip(props) {
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
                <div className="Header">
                    <p>New Trip</p>
                </div>
            </div>
        </div>
    )

}