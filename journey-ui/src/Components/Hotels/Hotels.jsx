import "./Hotels.css";
import * as React from "react";
import { Link } from "react-router-dom";
import background from "../Images/Background.png";
import axios from "axios";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';



export default function Hotels() {
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [hotelDetails, setHotelDetails] = React.useState([]);
    const [visibility, setVisibility] = React.useState('hidden');
    const [activityName, setActivityName] = React.useState('');
    const [activityDescription, setActivityDescription] = React.useState('');
    const [currentHotel, setCurrentHotel] = React.useState();
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

    const hotelResponse = (location) => {
        axios.get('https://hotels-com-provider.p.rapidapi.com/v1/destinations/search', { params: {
            query: location.city,
            currency: 'USD',
            locale: 'en_US'
        }, headers: {
            'X-RapidAPI-Key': 'c23bacec5fmsh0cbe448beb1c0efp1ff928jsna6b98a7788ff',
            'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
        }}).then(function (response) {
            console.log(response.data.suggestions[0].entities[0].destinationId);
            detailedResponse(location, response.data.suggestions[0].entities[0].destinationId)
        })
    }

    const detailedResponse = (location, id) => {
        axios.get('https://hotels-com-provider.p.rapidapi.com/v1/hotels/search', { params: {
            checkin_date: location.startDate,
            checkout_date: location.endDate,
            sort_order: 'STAR_RATING_HIGHEST_FIRST',
            destination_id: id,
            adults_number: location.numAdults,
            locale: 'en_US',
            currency: 'USD',
            // children_ages: '4,0,15',
            price_min: location.priceMin,
            // accommodation_ids: '20,8,15,5,1',
            price_max: location.priceMax,
            page_number: '1',
            // guest_rating_min: '4'
        }, headers: {
            'X-RapidAPI-Key': 'c23bacec5fmsh0cbe448beb1c0efp1ff928jsna6b98a7788ff',
            'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
        }
        }).then(function (response) {
            console.log(response);
            console.table(response);
            setHotelDetails(response.data.searchResults.results)
        })
    }

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

    function createActivity(hotel) {
        let id = String(Math.random() * 10000000) + activityName + activityDescription

        let activity = {
            id: id,
            name: activityName,
            startDate: new Date(hotel.startDate),
            endDate: new Date(hotel.endDate),
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
        setStartDate(date)
    }

    function handleEndChange(date) {
        setEndDate(date)
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

    function searchHotel() {
        console.log('startDate: ' + startDate.getDate())
        let startMonth = startDate.getMonth() + 1
        let startDay = startDate.getDate()
        let startStringDate = String(startDate.getFullYear() + '-' + dateFormat2(startMonth) + '-' + dateFormat2(startDay))

        console.log('endDate: ' + endDate.getDate())
        let endMonth = endDate.getMonth() + 1
        let endDay = endDate.getDate()
        let endStringDate = String(endDate.getFullYear() + '-' + dateFormat2(endMonth) + '-' + dateFormat2(endDay))

        let location = 
        {
            city: document.getElementById("location").value,
            startDate: startStringDate,
            endDate: endStringDate,
            numAdults: document.getElementById("traveler-number").value,
            priceMin: document.getElementById('price-min').value,
            priceMax: document.getElementById('price-max').value
        }
        hotelResponse(location)
    }

    return (
        <div>
            <div className="returnButtons">
                <Link to='/' onClick={logOut} id="dashLogOut" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px' }}>Log Out</Link>
                <Link to='/users/trip' id="BackToCal" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px' }}>Back To Calendar</Link>
            </div>
            <p>Find Your Perfect Hotel</p>
            <section>
                <input id="location" type="text" placeholder="Location" />
            </section>
            <form onSubmit={onStartFormSubmit}>
                <div className="form-group">
                    <DatePicker
                        selected={startDate}
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
                        selected={endDate}
                        onChange={handleEndChange}
                        name="startDate"
                        dateFormat="MM/dd/yyyy"
                    />
                    <p className="end">End Date</p>
                </div>
            </form>
            <section>
            <input id="traveler-number" type="number" min="0" placeholder="# of travelers" />
            </section>
            <section>
                <input id="price-min" type="number" min="0" placeholder="Minimum Price" />
            </section>
            <input id="price-max" type="number" min="0" placeholder="Maximum Price" />
            <section>
                <button onClick={() => {searchHotel();}}>Search Hotel</button>
            </section>
            <span className="popupText" id="myPopup" style={{ position: 'absolute', visibility: visibility, marginLeft: '450px', height: '500px', width: '450px' }}>New Activity
                <button onClick={() => { popUp(); }}>X</button>
                <section>
                    <input id="activityName" value={activityName} onChange={(e) => setActivityName(e.target.value)} type="text" />
                </section>
                <p>Description:</p>
                <input id="activityDescription" value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)} type="txt" style={{ width: '80%', height: '40%' }} />
                <button onClick={() => { createActivity(currentHotel); popUp(); }}>Create Activity</button>
            </span>
            <section>
                {
                    hotelDetails.map((hotel) => {
                        return (
                            <section>
                                <img src={hotel.optimizedThumbUrls.srpDesktop} alt="hotel image" />
                                <p>{hotel.name}</p>
                                <p>{hotel.address.streetAddress}</p>
                                <p>Star Rating: {hotel.starRating}</p>
                                <button onClick={()=>{popUp(); setCurrentHotel(hotel);}}>Add to calendar</button>
                            </section>
                        )
                    })
                }
            </section>
        </div>
    )
}
