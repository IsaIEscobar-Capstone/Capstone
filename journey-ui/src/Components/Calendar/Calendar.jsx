import "./Calendar.css";
import * as React from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function CalendarDays(props) {
    let firstDayOfMonth = new Date(props.day.getFullYear(), props.day.getMonth(), 1);
    let weekdayOfFirstDay = firstDayOfMonth.getDay();
    let currentDays = [];

    const [visibility, setVisibility] = React.useState('hidden');
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [activityName, setActivityName] = React.useState('');
    const [activityDescription, setActivityDescription] = React.useState('');
    const [activityList, setActivityList] = React.useState([]);

    function handleStartChange(date) {
        setStartDate(date)
    }

    function handleEndChange(date) {
        setEndDate(date)
    }

    function onStartFormSubmit(e) {
        e.preventDefault();
        console.log(startDate)
    }

    function onEndFormSubmit(e) {
        e.preventDefault();
        console.log(endDate)
    }

    function popUp() {
        if (visibility == 'hidden') {
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
        setStartDate(new Date());
        setEndDate(new Date());
        setActivityName('');
        setActivityDescription('');
    }

    function createActivity() {

        let activity = {
            name: activityName,
            startDate: startDate,
            endDate: endDate,
            description: activityDescription
        }
        setActivityList([...activityList, activity])

        setStartDate(new Date());
        setEndDate(new Date());
        setActivityName('');
        setActivityDescription('');
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

    return (
        <div className="calendar-content">
            {
                currentDays.map((day) => {
                    return (
                        <div className={"calendar-day" + (day.currentMonth ? " current" : "") + (day.selected ? " selected" : "")}
                            onClick={() => { props.changeCurrentDate(day); popUp(); }} key={"calendar-day" + day.number + day.currentMonth + (day.selected ? " selected" : "")}>
                            <p id="day-number">{day.number}</p>
                        </div>
                    )
                })
            }
            <span className="popupText" id="myPopup" style={{ position: 'absolute', visibility: visibility, marginLeft: '450px', height: '500px', width: '450px' }}>New Activity
            <button onClick={() => {popUp(); clearActivity();}}>X</button>
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
                <button onClick={() => {createActivity(); popUp();}}>Create Activity</button>
            </span>
            <button onClick={prevClicked}>Prev</button>
            <button onClick={nextClicked}>Next</button>
        </div>
    )
}

export default CalendarDays;