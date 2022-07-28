import "./Activities.css";
import * as React from "react";
import { Link } from "react-router-dom";
import background from "../Images/Background.png";
import axios from "axios";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';



export default function Activities() {
    const [originDate, setOriginDate] = React.useState(new Date());
    const [destinationDate, setDestinationDate] = React.useState(new Date());
    const [bestFlightDetails, setBestFlightDetails] = React.useState([]);
    const [cheapestFlightDetails, setCheapestFlightDetails] = React.useState([]);
    const [fastestFlightDetails, setFastestFlightDetails] = React.useState([]);
    const [visibility, setVisibility] = React.useState('hidden');
    const [activityName, setActivityName] = React.useState('');
    const [activityDescription, setActivityDescription] = React.useState('');
    const [currentFlight, setCurrentFlight] = React.useState();
    const PORT = 3001

    function timeConvert(n) {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + " hour(s) and " + rminutes + " minute(s).";
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

    const getResponse = () => {
        axios.post(`http://localhost:${PORT}/users/accessInfo`)
        .then(function (response) {
            let best = response.data.flightData.data.itineraries.buckets[0].items
            let bestList = []
            let fastest = response.data.flightData.data.itineraries.buckets[1].items
            let fastestList = []
            let cheapest = response.data.flightData.data.itineraries.buckets[2].items
            let cheapestList = []

            for (let i = 0; i < best.length; i++) {
                let temp = {
                    url: best[i].deeplink,
                    price: best[i].price.formatted,
                    connectionsAmount: best[i].legs[0].segments.length,
                    airline: best[i].legs[0].carriers.marketing[0],
                    tags: best[i].tags,
                    departure: best[i].legs[0].departure,
                    arrival: best[i].legs[0].arrival,
                    duration: timeConvert(best[i].legs[0].durationInMinutes)
                }
                bestList.push(temp)
            }
            for (let i = 0; i < fastest.length; i++) {
                let temp = {
                    url: fastest[i].deeplink,
                    price: fastest[i].price.formatted,
                    connectionsAmount: fastest[i].legs[0].segments.length,
                    airline:fastest[i].legs[0].carriers.marketing[0],
                    tags: fastest[i].tags,
                    departure: fastest[i].legs[0].departure,
                    arrival: fastest[i].legs[0].arrival,
                    duration: timeConvert(fastest[i].legs[0].durationInMinutes)
                }
                fastestList.push(temp)
            }
            for (let i = 0; i < cheapest.length; i++) {
                let temp = {
                    url: cheapest[i].deeplink,
                    price: cheapest[i].price.formatted,
                    connectionsAmount: cheapest[i].legs[0].segments.length,
                    airline: cheapest[i].legs[0].carriers.marketing[0],
                    tags: cheapest[i].tags,
                    departure: cheapest[i].legs[0].departure,
                    arrival: cheapest[i].legs[0].arrival,
                    duration: timeConvert(cheapest[i].legs[0].durationInMinutes)
                }
                cheapestList.push(temp)
            }

            localStorage.setItem('bestFlightDetails', bestList)
            localStorage.setItem('fastestFlightDetails', fastestList)
            localStorage.setItem('cheapestFlightDetails', cheapestList)
            setBestFlightDetails(bestList)
            setFastestFlightDetails(fastestList)
            setCheapestFlightDetails(cheapestList)

            console.log(bestList)
            console.log(fastestList)
            console.log(cheapestList)

            console.log(response)
        }
        )
    }

    // const setResponse = () => {
    //     axios.post(`http://localhost:${PORT}/users/flightExample`, {
    //         exampleRes: exampleRes
    //   })
    //   .catch(function(error) {
    //     console.log("Setting response failed: " + error.response);
    //   })
    //   }

    // const response = (temp) =>{
    // axios.get("https://skyscanner44.p.rapidapi.com/search", {params: {
    //     adults: temp.adults,
    //         origin: temp.origin,
    //         destination: temp.destination,
    //         departureDate: temp.departureDate,
    //         currency: temp.currency
    // }, headers: {
    //     'X-RapidAPI-Key': 'c23bacec5fmsh0cbe448beb1c0efp1ff928jsna6b98a7788ff',
    //     'X-RapidAPI-Host': 'skyscanner44.p.rapidapi.com'
    // }}).then(function (res) {
    //         axios.get("https://skyscanner44.p.rapidapi.com/search", {params: {
    //             adults: temp.adults,
    //                 origin: temp.origin,
    //                 destination: temp.destination,
    //                 departureDate: temp.departureDate,
    //                 currency: temp.currency
    //         }, headers: {
    //             'X-RapidAPI-Key': 'c23bacec5fmsh0cbe448beb1c0efp1ff928jsna6b98a7788ff',
    //             'X-RapidAPI-Host': 'skyscanner44.p.rapidapi.com'
    //         }}).then(function (response) {
    //             console.log(response)
    //             setFlightDetails(response.data.itineraries.buckets[0].items[0].deeplink)
    //             setExampleRes(response)
    //             setResponse()
    //         })
    //     }
    // )}

    const addActivity = (activity) => {
        axios.post(`http://localhost:${PORT}/users/activity`, {
            trip_id: localStorage.getItem('trip_id'),
            activity: activity
        })
            .catch(function (error) {
                console.log(error)
            })
    }
    function popUp() {
        if (visibility === 'hidden') {
            setVisibility('visible')
        }
        else {
            setVisibility('hidden')
        }
    }

    function createActivity(flight) {
        let id = String(Math.random() * 10000000) + activityName + activityDescription

        let activity = {
            id: id,
            name: activityName,
            startDate: new Date(flight.departure),
            endDate: new Date(flight.arrival),
            description: activityDescription
        }
        addActivity(activity)
        let temp = JSON.parse(localStorage.getItem('activityList'))
        temp.push(activity)
        localStorage.setItem('activityList', JSON.stringify(temp))
        console.log('activity update: ', JSON.parse(localStorage.getItem('activityList')))
    }

    function handleStartChange(date) {
        console.log('new origin: ', date)
        setOriginDate(date)
    }

    function handleEndChange(date) {
        setDestinationDate(date)
    }

    function onStartFormSubmit(e) {
        e.preventDefault();
    }

    function onEndFormSubmit(e) {
        e.preventDefault();
    }

    function dateFormat2(num) {
        if (num < 10) {
            return '0' + num
        }
        return num
    }

    function searchFlight() {
        console.log('originDate: ' + originDate.getDate())
        let originMonth = originDate.getMonth() + 1
        let originDay = originDate.getDate()
        let originStringDate = String(originDate.getFullYear() + '-' + dateFormat2(originMonth) + '-' + dateFormat2(originDay))
        let temp = {
            adults: String(document.getElementById("traveler-number").value),
            origin: document.getElementById("origin").value,
            destination: document.getElementById("destination").value,
            departureDate: originStringDate,
            currency: "USD"
        }
        console.log(temp)
        getResponse()
        // response(temp)
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
                <Link to='/' onClick={logOut} id="dashLogOut" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px' }}>Log Out</Link>
                <Link to='/users/trip' id="BackToCal" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px' }}>Back To Calendar</Link>
            </div>
            <p>Find Your Perfect Flight</p>
            <section>
                <input id="origin" type="text" placeholder="Origin" />
            </section>
            <input id="destination" type="text" placeholder="Destination" />
            <form onSubmit={onStartFormSubmit}>
                <div className="form-group">
                    <DatePicker
                        selected={originDate}
                        onChange={handleStartChange}
                        name="startDate"
                        dateFormat="MM/dd/yyyy"
                    />
                    <p className="start">Start Date</p>
                </div>
            </form>
            <form onSubmit={onEndFormSubmit}>
                <div className="form-group">
                    <DatePicker
                        selected={destinationDate}
                        onChange={handleEndChange}
                        name="startDate"
                        dateFormat="MM/dd/yyyy"
                    />
                    <p className="end">End Date</p>
                </div>
            </form>
            <input id="traveler-number" type="number" min="0" placeholder="# of travelers" />
            <section>
                <button onClick={() => {searchFlight();}}>Search Flight</button>
            </section>
            <span className="popupText" id="myPopup" style={{ position: 'absolute', visibility: visibility, marginLeft: '450px', height: '500px', width: '450px' }}>New Activity
                <button onClick={() => { popUp(); }}>X</button>
                <section>
                    <input id="activityName" value={activityName} onChange={(e) => setActivityName(e.target.value)} type="text" />
                </section>
                <p>Description:</p>
                <input id="activityDescription" value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)} type="txt" style={{ width: '80%', height: '40%' }} />
                <button onClick={() => { createActivity(currentFlight); popUp(); }}>Create Activity</button>
            </span>
            <section>Best
                {
                    bestFlightDetails.map((flight) => {
                        return (
                            <section>
                                <p>{flight.airline.name}</p>
                                <p>{flight.departure}</p>
                                <p>{flight.arrival}</p>
                                <p>{flight.connectionsAmount} connections</p>
                                <p>{flight.price}</p>
                                <p>{flight.duration}</p>
                                <a href={flight.url} target="_blank">More Info/Booking</a>
                                <button onClick={()=>{popUp(); setCurrentFlight(flight);}}>Add to calendar</button>
                            </section>
                        )
                    })
                }
            </section>
            <section>Cheapest
                {
                    cheapestFlightDetails.map((flight) => {
                        return (
                            <section>
                                <p>{flight.airline.name}</p>
                                <p>{flight.departure}</p>
                                <p>{flight.arrival}</p>
                                <p>{flight.connectionsAmount} connections</p>
                                <p>{flight.price}</p>
                                <p>{flight.duration}</p>
                                <a href={flight.url} target="_blank">More Info/Booking</a>
                                <button onClick={()=>{popUp();setCurrentFlight(flight);}}>Add to calendar</button>
                            </section>
                        )
                    })
                }
            </section>
            <section>Fastest
                {
                    fastestFlightDetails.map((flight) => {
                        return (
                            <section>
                                <p>{flight.airline.name}</p>
                                <p>{flight.departure}</p>
                                <p>{flight.arrival}</p>
                                <p>{flight.connectionsAmount} connections</p>
                                <p>{flight.price}</p>
                                <p>{flight.duration}</p>
                                <a href={flight.url} target="_blank">More Info/Booking</a>
                                <button onClick={()=>{popUp();setCurrentFlight(flight);}}>Add to calendar</button>
                            </section>
                        )
                    })
                }
            </section>
        </div>
    )
}
