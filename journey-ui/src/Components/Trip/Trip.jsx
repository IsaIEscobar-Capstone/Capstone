import "./Trip.css";
import * as React from "react";
import background from "../Images/Background.png";
import { Link } from "react-router-dom";
import axios from "axios";
import CalendarDays from "../Calendar/Calendar";

export default function Trip(props) {

    const [currentDay, setCurrentDay] = React.useState(new Date())
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
                height: '100vh'
            }}>
                <div className="returnButtons">
                <Link to='/' onClick={response} id= "dashLogOut" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px'}}>Log Out</Link>
                <Link to='/users/dashboard' id="BackToDash" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px'}}>Back To Dash</Link>
                </div>
            {/* <div className="returnButtons">
                <Link to='/' id="logOut" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', width: '200px', marginRight: '90%', marginTop: "-0.8%" }}>Log Out</Link>
                <Link to='/users/dashboard' id="BackToDash" style={{textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', width: '150px'}}>Back To Dash</Link>
            </div> */}
            <div className="Home">
                <div className="Header">
                    <p>New Trip</p>
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