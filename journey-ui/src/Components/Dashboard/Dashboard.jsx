import "./Dashboard.css";
import * as React from "react";
import { Link } from "react-router-dom";
import background from "../Images/Background.png";
import axios from "axios";


export default function Dashboard(props) {
    console.log('currentTripList: ' + props.currentTripList);
    // console.log('currentTripList[0]: ' + props.currentTripList[0]);
    // console.log(props.currentTripList)
    const [visibility, setVisibility] = React.useState('hidden');
    const PORT = 3001

    const response = () => {
        axios.post(`http://localhost:${PORT}/users/dashboard`, {
            sessionToken: props.sessionToken
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
            username: props.username
        })
            .catch(function (error) {
                console.log(error)
            })
    }

    function popUp() {
        if (visibility == 'hidden') {
            setVisibility('visible')
        }
        else {
            setVisibility('hidden')
        }
    }

    function updateTrip() {
        var vacationName = document.getElementById('tripName').value
        console.log(vacationName)
        props.handleCurrentTrip(vacationName)
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
            <Link to='/' onClick={response} id="logOut" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', width: '200px', marginRight: '90%' }}>Log Out</Link>
            <div className="Home">
                <div className="Header">
                    <p>{props.username.toUpperCase()}'S Trip Dashboard</p>
                    <hr id="DashDivide" />
                </div>
                <div className="Dash">
                    <p style={{ paddingLeft: '10px', height: '20px', width: '100px' }}>Current Trips:</p>
                    <div className="currentTrips">
                    {
                        props.currentTripList.map((trip) => {
                            return (
                                <section>
                                    <div key={trip.id} style={{margin: '0.5vh', border: '2px solid white', borderRadius: '5px', height: '30px', width: '200px'}}>{trip.name}</div>
                                </section>
                            )
                        })
                    }
                    </div>
                    <div className="popUp" onClick={popUp} style={{ marginLeft: '100px', textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', height: '20px', width: '200px', marginTop: '34%' }}>New Trip</div>
                    <span className="popupText" id="myPopup" style={{ visibility: visibility }}>Name Your Trip
                        <section>
                            <input id="tripName" placeholder="Vacation..." type="text" style={{ marginTop: '1vh', padding: '5px' }} />
                        </section>
                        <section>
                            <Link to='/users/trip' onClick={() => { calResponse(); updateTrip(); }} id="NewTrip" style={{ textDecoration: 'none', color: 'black', border: '2px solid black', borderRadius: '5px', height: '20px', width: '200px', margin: '10vh' }}>New Trip</Link>
                        </section>
                    </span>
                    <hr id="TripsDivide" />
                    <p style={{ paddingRight: '42%', height: '20px', width: '100px' }}>Past Trips:</p>
                </div>
            </div>
        </div>
    )

}