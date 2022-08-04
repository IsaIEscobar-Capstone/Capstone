import "./Trip.css";
import * as React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CalendarDays from "../Calendar/Calendar";
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import {storage} from "../Firebase"
import { useEffect } from "react";

export default function Trip() {
    const [currentDay, setCurrentDay] = React.useState(new Date())
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const [currentFiles, setCurrentFiles] = React.useState(null);
    const [currentImgUrl, setCurrentImgUrl] = React.useState('');
    const [loadingPercent, setLoadingPercent] = React.useState(0);

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

    useEffect(() => {
        if (currentFiles != null) {
            const imgRef = ref(storage, `images/${currentFiles.name}`)
            const uploadTask = uploadBytesResumable(imgRef, currentFiles);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferre / snapshot.totalBytes) * 100
                    );

                    setLoadingPercent(percent);
                },
            (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    setCurrentImgUrl(url)

                });
        })
    }
    }, [currentFiles])

    const fileUpload = () => {
        axios.post(`http://localhost:${PORT}/users/uploadPhotos`, {
            trip_id: localStorage.getItem('trip_id'),
            imgUrl: currentImgUrl
        })
    }

    function changeCurrentDate(day) {
        setCurrentDay(new Date(day.year, day.month, day.number));
    }

    function onChange(e) {
        console.log(e.target.files[0])
        setCurrentFiles(e.target.files[0]);
    }

    return (
        <div>
            <div className="returnButtons">
                <Link to='/' onClick={response} id="dashLogOut" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px' }}>Log Out</Link>
                <Link to='/users/dashboard' onClick={tripResponse} id="BackToDash" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px' }}>Back To Dash</Link>
            </div>
            <form id="file-form" onSubmit={fileUpload}>
            <input type="file" name="trip-photos" onChange={onChange}/>
            <input type="submit" value="Upload your files"/>
            </form>
            <div className="SearchActivities">
                <section style={{marginBottom: '4vh'}}>
                <Link to='/users/hotels' id='hotelSearch' style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px', marginRight: '-85%'}}>Search Hotels</Link>
                </section>
                <section>
                <Link to='/users/activitySearch' id="activitySearch" style={{ textDecoration: 'none', color: 'white', border: '2px solid white', borderRadius: '5px', padding: '10px', marginRight: '-85%'}}>Search Flights</Link>
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