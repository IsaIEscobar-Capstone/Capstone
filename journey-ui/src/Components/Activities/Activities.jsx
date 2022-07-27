import "./Activities.css";
import * as React from "react";
import { Link } from "react-router-dom";
import background from "../Images/Background.png";
import axios from "axios";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Activities(props) {
    const [startDate, setStartDate] = React.useState(props.day);
    const [endDate, setEndDate] = React.useState(props.day);

    function handleStartChange(date) {
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
        <input id="destination" type="text" placeholder="Destination"/>
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
        <input id="traveler-number" type="number" min="0" placeholder="# of travelers"/>


    </div>
    )
}
