import "./Trip.css";
import * as React from "react";
import background from "../Images/Background.png";
import { Link } from "react-router-dom";
import axios from "axios";
import CalendarDays from "../Calendar/Calendar";

export default function Trip() {
    const [currentDay, setCurrentDay] = React.useState(new Date())
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const PORT = 3001
    const response = () => {
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

    const tripResponse = () => {
        axios.post(`http://localhost:${PORT}/users/tripList`, {
            username: localStorage.getItem('username')
        })
            .then(function (response) {
                localStorage.setItem('tripList', JSON.stringify(response.data.trips))
                localStorage.setItem('activityList', JSON.stringify([]))
            })
            .catch(function (error) {
                console.log("Trip list update failed: " + error.response.data);
            })
    }

    function changeCurrentDate(day) {
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
                <Link to='/' onClick={response} id="dashLogOut" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px' }}>Log Out</Link>
                <Link to='/users/dashboard' onClick={tripResponse} id="BackToDash" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px' }}>Back To Dash</Link>
            </div>
            <div className="SearchActivities">
                <section style={{marginBottom: '4vh'}}>
                <Link to='/users/hotels' id='hotelSearch' style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px', marginRight: '-85%'}}>Search Hotels</Link>
                </section>
                <section>
                <Link to='/users/activitySearch' id="activitySearch" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px', marginRight: '-85%'}}>Search Activities</Link>
                </section>
            </div>
            <div className="Home">
                <div className="Header">
                    <h2>{localStorage.getItem('currentTrip')}</h2>
                    <h2>{months[currentDay.getMonth()]} {currentDay.getFullYear()}</h2>
                </div>
                <div className="weekly-header">
                    {
                        weekdays.map((weekday) => {
                            return <div className="weekday" key={weekday}><p>{weekday}</p></div>
                        })
                    }
                </div>
                <CalendarDays
                    day={currentDay}
                    changeCurrentDate={changeCurrentDate}
                />
            </div>
        </div>
    )

}