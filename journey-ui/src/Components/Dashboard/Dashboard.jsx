import "./Dashboard.css";
import * as React from "react";
import { Link } from "react-router-dom";
import DeletePopup from '../DeletePopup/DeletePopup';
import axios from "axios";
import { useNavigate } from 'react-router';


export default function Dashboard(props) {
    let navigate = useNavigate();
    const [visibility, setVisibility] = React.useState('hidden');
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

    // const tripResponse = () => {
    //     axios.post(`http://localhost:${PORT}/users/tripList`, {
    //         username: localStorage.getItem('username')
    //     })
    //         .then(function (response) {
    //             localStorage.setItem('tripList', JSON.stringify(response.data.trips))
    //             localStorage.setItem('activityList', JSON.stringify([]))
    //             console.log('hi')
    //             console.log(JSON.parse(localStorage.getItem('tripList')))
    //         })
    //         .catch(function (error) {
    //             console.log("Trip list update failed: " + error.response.data);
    //         })
    // }

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

    const responseDelete = (trip_id) => {
        axios.post(`http://localhost:${PORT}/users/deleteCalendar`, {
            trip_id: trip_id,
            username: localStorage.getItem('username')
        })
        .catch(function (error) {
            console.log('hi hoe')
            console.log(error)
        })
    }

    function deleteFromList(trip_id) {
        let temp = JSON.parse(localStorage.getItem('tripList')).filter(trip => trip.id != trip_id)
        localStorage.setItem('tripList', JSON.stringify(temp))
        window.location.reload()
        // console.log(JSON.parse(localStorage.getItem('tripList')))
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


    function updateTrip() {
        var vacationName = document.getElementById('tripName').value
        localStorage.setItem('currentTrip', vacationName)
        // props.handleCurrentTrip(vacationName)
    }

    return (
        <div>
            <Link to='/' onClick={response} id="logOut" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', width: '200px', marginRight: '90%' }}>Log Out</Link>
            <div className="Home">
                <div className="Header">
                    <p>{localStorage.getItem('username').toUpperCase()}'S Trip Dashboard</p>
                    <hr id="DashDivide" />
                </div>
                <div className="Dash">
                    <div className="currentTrips">
                        {
                            JSON.parse(localStorage.getItem('tripList')).map((trip) => {
                                return (
                                    <section key={trip.id}>
                                        <button to='/users/trip' onClick={() => { responseList(trip.id); calendarClicked(trip.id, trip.name); }} key={trip.id} style={{ color: 'white', textDecoration: 'none', margin: '0.5vh', border: '2px solid white', borderRadius: '5px', width: '300px' , backgroundColor: 'transparent'}}>{trip.name}</button>
                                        <input id={trip.name + ' ' + trip.id} placeholder="Friend Username..." type="text" style={{ backgroundColor: 'transparent', border: '2px solid white', borderRadius: '5px',}}/>
                                        <button onClick={() => responseShare(trip.id, trip.name, document.getElementById(trip.name + ' ' + trip.id).value)} style={{ color: 'white', textDecoration: 'none', margin: '0.5vh', border: '2px solid white', borderRadius: '5px', width: '150px' , backgroundColor: 'transparent'}}>Share with friend</button>
                                        <DeletePopup 
                                        responseDelete={responseDelete}
                                        trip={trip}
                                        deleteFromList={deleteFromList}
                                        />
                                    </section>
                                )
                            })
                        }
                        <div style={{backgroundColor: 'white', borderRadius: '10px', height: '17vh', width: '15vw', marginLeft: '26vh', visibility: visibility}}>
                        <span className="popupText" id="myPopup" style={{ visibility: visibility, backgroundColor: 'white'}}>Name Your Trip
                            <button onClick={popUp} style={{backgroundColor: 'transparent', borderRadius: '60%', marginRight:'-2.5vw', marginLeft: '2vw'}}>X</button>
                            <section>
                                <input id="tripName" placeholder="Vacation..." type="text" style={{ marginTop: '2.5vh', padding: '5px' , marginBottom: '1vh'}} />
                            </section>
                            <section>
                                <Link to='/users/trip' onClick={() => { calResponse(); updateTrip(); }} id="newTrip" style={{ textDecoration: 'none', color: 'black', border: '2px solid black', borderRadius: '5px', height: '30px', width: '200px'}}>New Trip</Link>
                            </section>
                        </span>
                        </div>
                        <div className="popUp" onClick={popUp} style={{ marginLeft: '15vw', textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', height: '20px', width: '200px', marginTop: '10%' , padding: '2%', paddingBottom: '5%', marginBottom: '5%'}}>New Trip</div>
                        </div>
                </div>
            </div>
        </div>
    )

}