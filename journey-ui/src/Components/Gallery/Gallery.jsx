import "./Gallery.css";
import * as React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DeletePhoto from "../DeletePhoto/DeletePhoto"

export default function Gallery() {
    const PORT = 3001

    const deletePhoto = (photoLink) => {
        axios.post(`http://localhost:${PORT}/users/deletePhoto`, {
            trip_id: localStorage.getItem('trip_id'),
            photoLink: photoLink
        })
            .catch(function (error) {
                console.log(error)
            })
    }

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

    return (
        <div>
            <div className="returnButtons">
                <Link to='/' onClick={logOut} id="dashLogOut" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px' }}>Log Out</Link>
                <Link to='/users/trip' onClick={() => { localStorage.setItem("photoList", []) }} id="BackToCal" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px' }}>Back To Calendar</Link>
            </div>
            <p className="GalleryTitle">{localStorage.getItem('currentTrip')}'s Gallery</p>
            <div className="PhotoDisplay">
                {
                    JSON.parse(localStorage.getItem("photoList")).map((photo) => {
                        return (
                            <div>
                            <section>
                                <img src={photo} alt="trip photo" style={{ width: '300px', height: '300px', borderRadius: '10px', padding: '10px', border: '2px solid white', margin: '50px' }} />
                            </section>
                            <DeletePhoto
                                responseDelete={deletePhoto}
                                photoLink={photo}
                            />
                            </div>
                        )
                    })
                }
            </div>

        </div>

    )
}