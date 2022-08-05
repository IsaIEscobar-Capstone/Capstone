import "./Gallery.css";
import * as React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Gallery() {
    const PORT = 3001

    const logOut = () => {
        axios.post(`http://localhost:${PORT}/users/dashboard`, {
            sessionToken: localStorage.getItem('sessionToken')
        })

            .then(function (response) {
                console.log("sessionToken: " + response.data.sessionToken)
            })

            .catch(function (error) {
                console.log(error)
            })
    }

    return(
        <div>
            <div className="returnButtons">
                <Link to='/' onClick={logOut} id="dashLogOut" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px' }}>Log Out</Link>
                <Link to='/users/trip' onClick={()=>{localStorage.setItem("photoList", [])}}id="BackToCal" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px' }}>Back To Calendar</Link>
            </div>
        <p>{localStorage.getItem('currentTrip')} Gallery</p>
        {
            JSON.parse(localStorage.getItem("photoList")).map((photo) => {
                return(
                <section>
                <img src={photo} alt="trip photo" style={{width: '300px', height: '300px', margin: '50px'}}/>
                </section>
            )
            })
        }
        </div>

    )
}