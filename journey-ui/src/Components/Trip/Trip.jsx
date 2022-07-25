import "./Trip.css";
import * as React from "react";
import background from "../Images/Background.png";
import { Link } from "react-router-dom";
import axios from "axios";
import CalendarDays from "../Calendar/Calendar";

export default function Trip(props) {

    const [currentDay, setCurrentDay] = React.useState(new Date())
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];

    const PORT = 3001
    const response = () => {
      axios.post(`http://localhost:${PORT}/users/dashboard`, {
        sessionToken : props.sessionToken
    })

    .then(function(response) {
      console.log("hi: " + response.data.sessionToken)
    //   props.handleSessionToken(response.data.sessionToken)
    //   props.handleUsername(document.getElementById('username').value);
    })

    .catch(function(error) {
        console.log(error)
    //   props.handleSignInErrorMessage("Sign in failed: " + error.response.data.error);
    })
    }

    const tripResponse = () => {
        axios.post(`http://localhost:${PORT}/users/tripList`, {
            username: props.username
        })
        .then(function(response) {
            console.log('response:' + response)
            props.handleCurrentTripList(response.data.trips)
            console.log('trips response: ' + response.data.trips)
            console.log(props.currentTripList)
        })
        .catch(function (error) {
            console.log("Trip list update failed: " + error.response.data);
          })
    }

    function changeCurrentDate(day) {
        console.log(day)
        console.log(day.year)
        console.log(day.month)
        console.log(day.number)
        setCurrentDay(new Date(day.year, day.month, day.number));
    }

    return (
        <div className="background"
            style={{
                backgroundImage: `url(${background})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: 'cover',
                width: '100vw',
                height: '150vh'
            }}>
                <div className="returnButtons">
                <Link to='/' onClick={response} id= "dashLogOut" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px'}}>Log Out</Link>
                <Link to='/users/dashboard' onClick={tripResponse} id="BackToDash" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px'}}>Back To Dash</Link>
                </div>
            <div className="Home">
                <div className="Header">
                    <h2>{props.currentTrip}</h2>
                    <h2>{months[currentDay.getMonth()]} {currentDay.getFullYear()}</h2>
                </div>
                <div className="weekly-header">
                    {
                    weekdays.map((weekday) => {
                        return <div className="weekday" key={weekday}><p>{weekday}</p></div>
                    })
                    }
                </div>
                <CalendarDays day={currentDay} changeCurrentDate={changeCurrentDate}/>
            </div>
        </div>
    )

}