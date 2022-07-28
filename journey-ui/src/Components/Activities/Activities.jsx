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
    const [flightDetails, setFlightDetails] = React.useState('');
    const [exampleRes, setExampleRes] = React.useState();
    const PORT = 3001

    const setResponse = () => {
        axios.post(`http://localhost:${PORT}/users/flightExample`, {
            exampleRes: exampleRes
      })
      .catch(function(error) {
        console.log("Setting response failed: " + error.response);
      })
      }

    const response = (temp) =>{
    axios.get("https://skyscanner44.p.rapidapi.com/search", {params: {
        adults: temp.adults,
            origin: temp.origin,
            destination: temp.destination,
            departureDate: temp.departureDate,
            currency: temp.currency
    }, headers: {
        'X-RapidAPI-Key': 'c23bacec5fmsh0cbe448beb1c0efp1ff928jsna6b98a7788ff',
        'X-RapidAPI-Host': 'skyscanner44.p.rapidapi.com'
    }}).then(function (res) {
            axios.get("https://skyscanner44.p.rapidapi.com/search", {params: {
                adults: temp.adults,
                    origin: temp.origin,
                    destination: temp.destination,
                    departureDate: temp.departureDate,
                    currency: temp.currency
            }, headers: {
                'X-RapidAPI-Key': 'c23bacec5fmsh0cbe448beb1c0efp1ff928jsna6b98a7788ff',
                'X-RapidAPI-Host': 'skyscanner44.p.rapidapi.com'
            }}).then(function (response) {
                console.log(response)
                setFlightDetails(response.data.itineraries.buckets[0].items[0].deeplink)
                setExampleRes(response)
                setResponse()
            })
        }
    )}

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
        // let destinationStringDate = String(destinationDate.getFullYear() + '-' + destinationDate.getMonth() + 1 + '-' + destinationDate.getDay())
        let temp = {
            adults: String(document.getElementById("traveler-number").value),
            origin: document.getElementById("origin").value,
            destination: document.getElementById("destination").value,
            departureDate: originStringDate,
            currency: "USD"
        }
        console.log(temp)
        response(temp)
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
            <section>
                <p>{flightDetails}</p>
            </section>
        </div>
    )
}
