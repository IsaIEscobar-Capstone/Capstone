import "./Calendar.css";
import * as React from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

function CalendarDays(props) {
    const PORT = 3001
    let firstDayOfMonth = new Date(props.day.getFullYear(), props.day.getMonth(), 1);
    let weekdayOfFirstDay = firstDayOfMonth.getDay();
    let currentDays = [];

    const [visibility, setVisibility] = React.useState('hidden');
    const [startDate, setStartDate] = React.useState(props.day);
    const [endDate, setEndDate] = React.useState(props.day);
    const [activityName, setActivityName] = React.useState('');
    const [activityDescription, setActivityDescription] = React.useState('');
    const [dVisibility, setDVisibility] = React.useState('hidden');
    const [currentDescription, setCurrentDescription] = React.useState('');
    const [currentActivity, setCurrentActivity] = React.useState();
    const [doubleCheck, setDoubleCheck] = React.useState('hidden');

    const response = (activity) => {
        axios.post(`http://localhost:${PORT}/users/activity`, {
            trip_id: localStorage.getItem('trip_id'),
            activity: activity
        })
            .catch(function (error) {
                console.log(error)
            })
    }

    const responseDelete = () => {
        axios.post(`http://localhost:${PORT}/users/removeActivity`, {
            trip_id: localStorage.getItem('trip_id'),
            activity: currentActivity
        })
            .catch(function (error) {
                console.log(error)
            })
    }

    function handleDoubleCheck() {
        if (doubleCheck === 'hidden') {
            setDoubleCheck('visible')
        }
        else {
            setDoubleCheck('hidden')
        }
    }

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

    function popUp() {
        if (visibility === 'hidden') {
            setStartDate(new Date());
            setVisibility('visible')
        }
        else {
            setVisibility('hidden')
        }
    }

    function nextClicked() {
        if (props.day.getMonth() < 11) {
            props.day.setMonth(parseInt(props.day.getMonth()) + 1)
        }
        else {
            props.day.setMonth(0)
            props.day.setFullYear(props.day.getFullYear() + 1)
        }
        var new_d = {
            currentMonth: (true),
            date: (new Date(props.day)),
            month: props.day.getMonth(),
            number: props.day.getDate(),
            selected: (firstDayOfMonth.toDateString() === props.day.toDateString()),
            year: props.day.getFullYear()
        }
        props.changeCurrentDate(new_d);
    }

    function prevClicked() {
        if (props.day.getMonth() > 0) {
            props.day.setMonth(parseInt(props.day.getMonth()) - 1)
        }
        else {
            props.day.setMonth(11)
            props.day.setFullYear(props.day.getFullYear() - 1)
        }
        var new_d = {
            currentMonth: (true),
            date: (new Date(props.day)),
            month: props.day.getMonth(),
            number: props.day.getDate(),
            selected: (firstDayOfMonth.toDateString() === props.day.toDateString()),
            year: props.day.getFullYear()
        }
        props.changeCurrentDate(new_d);
    }

    function clearActivity() {
        setEndDate(props.day)
        setActivityName('');
        setActivityDescription('');
    }

    function createActivity() {
        let id = String(Math.random() * 10000000) + activityName + activityDescription

        let activity = {
            id: id,
            name: activityName,
            startDate: startDate,
            endDate: endDate,
            description: activityDescription
        }
        response(activity)
        let temp = JSON.parse(localStorage.getItem('activityList'))
        temp.push(activity)
        localStorage.setItem('activityList', JSON.stringify(temp))
        setEndDate(props.day)
        setActivityName('');
        setActivityDescription('');
    }

    function deleteActivity() {
        let new_aList = []
        for (let i = 0; i < JSON.parse(localStorage.getItem('activityList')).length; i++) {
            if (JSON.parse(localStorage.getItem('activityList'))[i].id != currentActivity.id) {
                new_aList.push(JSON.parse(localStorage.getItem('activityList'))[i])
            }
        }
        localStorage.setItem('activityList', JSON.stringify(new_aList));
    }

    function descriptionPopUp() {
        if (dVisibility == 'hidden') {
            setDVisibility('visible')
        }
        else {
            setDVisibility('hidden')
        }
    }




    for (let day = 0; day < 42; day++) {
        if (day === 0 && weekdayOfFirstDay === 0) {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
        } else if (day === 0) {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (day - weekdayOfFirstDay));
        } else {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
        }

        let calendarDay = {
            currentMonth: (firstDayOfMonth.getMonth() === props.day.getMonth()),
            date: (new Date(firstDayOfMonth)),
            month: firstDayOfMonth.getMonth(),
            number: firstDayOfMonth.getDate(),
            selected: (firstDayOfMonth.toDateString() === props.day.toDateString()),
            year: firstDayOfMonth.getFullYear()
        }

        currentDays.push(calendarDay);
    }

    React.useEffect(() => { setStartDate(props.day); });

    return (
        <div className="calendar-content">
            {
                currentDays.map((day) => {
                    let aName = []
                    for (let i = 0; i < JSON.parse(localStorage.getItem('activityList')).length; i++) {
                        let tempStart = new Date(JSON.parse(localStorage.getItem('activityList'))[i].startDate);
                        let tempEnd = new Date(JSON.parse(localStorage.getItem('activityList'))[i].endDate);
                        if (tempStart.getFullYear() <= day.date.getFullYear() && day.date.getFullYear() <= tempEnd.getFullYear() &&
                            tempStart.getMonth() <= day.date.getMonth() && day.date.getMonth() <= tempEnd.getMonth() &&
                            tempStart.getDate(0) <= day.date.getDate() && day.date.getDate() <= tempEnd.getDate()
                        ) {
                            console.log(JSON.parse(localStorage.getItem('activityList'))[i])
                            aName.push(JSON.parse(localStorage.getItem('activityList'))[i])
                        }
                    }
                    console.log(aName)
                    return (
                        <div className={"calendar-day" + (day.currentMonth ? " current" : "") + (day.selected ? " selected" : "")}
                            onDoubleClick={() => { clearActivity(); popUp(); props.changeCurrentDate(day) }} key={"calendar-day" + day.number + day.currentMonth + (day.selected ? " selected" : "")}>
                            <div id="day-number">{day.number}
                                <section className='activities-section'>
                                    {
                                        aName.map((activity) => {
                                            return (
                                                <section>
                                                    <p onClick={() => { descriptionPopUp(); setCurrentDescription(activity.description); setCurrentActivity(activity); }}>{activity.name}</p>
                                                </section>
                                            )
                                        })
                                    }
                                </section>
                            </div>
                        </div>
                    )
                })
            }
            <span className="popupText" id="myPopup" style={{ position: 'absolute', visibility: visibility, marginLeft: '450px', height: '500px', width: '450px' }}>New Activity
                <button onClick={() => { clearActivity(); popUp(); }}>X</button>
                <section>
                    <input id="activityName" value={activityName} onChange={(e) => setActivityName(e.target.value)} type="text" />
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
                <p>Description:</p>
                <input id="activityDescription" value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)} type="txt" style={{ width: '80%', height: '40%' }} />
                <button onClick={() => { createActivity(); popUp(); }}>Create Activity</button>
            </span>
            <span className="popupDescription" id="myDescription" style={{ position: 'absolute', visibility: dVisibility, backgroundColor: 'white', color: 'black', minHeight: '80px', minWidth: '100px', marginLeft: '30%', marginTop: '20%' }}>
                <button onClick={() => { descriptionPopUp(); }} style={{ marginRight: '-67%', marginLeft: '10%' }}>X</button>
                <p>{currentDescription}</p>
                <button onClick={() => {descriptionPopUp(); handleDoubleCheck();}}>Delete Activity</button>
                <span className="deletePopUP" style={{ visibility: doubleCheck , backgroundColor: "white", color: "black"}}>
                <button onClick={() => {handleDoubleCheck()}}>X</button>
                <p>Are you sure you want to delete this trip?</p>
                <button onClick={() => { responseDelete(); deleteActivity(); handleDoubleCheck(); }}>yes</button>
                </span>
            </span>
            <button onClick={prevClicked}>Prev</button>
            <button onClick={nextClicked}>Next</button>
        </div>
    )
}

export default CalendarDays;