import "./Dashboard.css";
import * as React from "react";
import { Link } from "react-router-dom";
import background from "../Images/Background.png";
import axios from "axios";
import { useNavigate } from 'react-router';


export default function Dashboard(props) {
    let navigate = useNavigate();
    const [visibility, setVisibility] = React.useState('hidden');
    const [dVisibility, setDVisibility] = React.useState('hidden');
    const PORT = 3001

    const response = () => {
        axios.post(`http://localhost:${PORT}/users/dashboard`, {
            sessionToken: localStorage.getItem('sessionToken')
        })

            .then(function (response) {
                console.log(response.data.sessionToken)
            })

            .catch(function (error) {
                console.log(error)
            })
    }

    const calResponse = () => {
        axios.post(`http://localhost:${PORT}/users/trip`, {
            vacationName: document.getElementById('tripName').value,
            username: localStorage.getItem('username')
        })
            .then(function (response) {
                localStorage.setItem('trip_id', response.data.trip_id)
                localStorage.setItem('currentTrip', document.getElementById('tripName').value)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const responseList = (trip_id) => {
        axios.post(`http://localhost:${PORT}/users/calendar`, {
            trip_id: trip_id
        })
            .then(function (response) {
                localStorage.setItem('activityList', JSON.stringify(response.data.activities))
                console.log('activityList: ', JSON.parse(localStorage.getItem('activityList')));
                navigate("/users/trip")
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const responseShare = (trip_id, trip_name, user) => {
        axios.post(`http://localhost:${PORT}/users/share`, {
            user: user,
            trip_id: trip_id,
            trip_name: trip_name
        })
            .catch(function (error) {
                console.log(error)
            })
    }

    function calendarClicked(trip_id, trip_name) {
        localStorage.setItem('trip_id', trip_id)
        localStorage.setItem('currentTrip', trip_name)
    }

    function popUp() {
        if (visibility === 'hidden') {
            setVisibility('visible')
        }
        else {
            setVisibility('hidden')
        }
    }

    function deletePopUp() {
        if (dVisibility === 'hidden') {
            setDVisibility('visible')
        }
        else {
            setDVisibility('hidden')
        }
    }

    function updateTrip() {
        var vacationName = document.getElementById('tripName').value
        localStorage.setItem('currentTrip', vacationName)
        // props.handleCurrentTrip(vacationName)
    }

    return (
        <div>
        {/* className="background" */}
        {/* //     style={{ */}
        {/* //         backgroundImage: `url(${background})`,
        //         backgroundRepeat: "no-repeat",
        //         backgroundSize: 'cover',
        //         width: '100vw',
        //         height: '100vh'
        //     }}> */}
            <Link to='/' onClick={response} id="logOut" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', width: '200px', marginRight: '90%' }}>Log Out</Link>
            <div className="Home">
                <div className="Header">
                    <p>{localStorage.getItem('username').toUpperCase()}'S Trip Dashboard</p>
                    <hr id="DashDivide" />
                </div>
                <div className="Dash">
                    {/* <p style={{ paddingLeft: '10px', height: '20px', width: '100px' }}>Current Trips:</p> */}
                    <div className="currentTrips">
                        {
                            JSON.parse(localStorage.getItem('tripList')).map((trip) => {
                                return (
                                    <section>
                                        <button to='/users/trip' onClick={() => { responseList(trip.id); calendarClicked(trip.id, trip.name); }} key={trip.id} style={{ color: 'white', textDecoration: 'none', margin: '0.5vh', border: '2px solid white', borderRadius: '5px', width: '300px' }}>{trip.name}</button>
                                        <input id={trip.name + ' ' + trip.id} placeholder="Friend Username..." type="text" />
                                        <button onClick={() => responseShare(trip.id, trip.name, document.getElementById(trip.name + ' ' + trip.id).value)}>Share with friend</button>
                                        <button onClick={() => {deletePopUp()}}>Delete Trip</button>
                                        <div className="deletePopUP" style={{ visibility: dVisibility , backgroundColor: "white", color: "black"}}>
                                            <p>Are you sure you want to delete this trip?</p>
                                            <button onClick={deletePopUp}>yes</button>
                                        </div>
                                    </section>
                                )
                            })
                        }
                        <div className="popUp" onClick={popUp} style={{ marginLeft: '15vw', textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', height: '20px', width: '200px', marginTop: '10%' , padding: '2%', paddingBottom: '5%'}}>New Trip</div>
                        <span className="popupText" id="myPopup" style={{ visibility: visibility}}>Name Your Trip
                        <button onClick={popUp}>X</button>
                            <section>
                                <input id="tripName" placeholder="Vacation..." type="text" style={{ marginTop: '1vh', padding: '5px' }} />
                            </section>
                            <section>
                                <Link to='/users/trip' onClick={() => { calResponse(); updateTrip(); }} id="newTrip" style={{ textDecoration: 'none', color: 'black', border: '2px solid black', borderRadius: '5px', height: '30px', width: '200px'}}>New Trip</Link>
                            </section>
                            <section>
                            <Link to='/users/hotels' onClick={() => { calResponse(); updateTrip(); }} id="newTrip" style={{ textDecoration: 'none', color: 'black', border: '2px solid black', borderRadius: '5px', height: '30px', width: '200px'}}>New Trip</Link>
                            </section>
                        </span>
                    </div>
                    {/* <hr id="TripsDivide" />
                    <p style={{ paddingRight: '30%', height: '20px', width: '200px' }}>Past Trips:</p> */}
                </div>
            </div>
        </div>
    )

}