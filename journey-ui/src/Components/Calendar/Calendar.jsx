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
    const [startDate, setStartDate] = React.useState(props.day);
    const [endDate, setEndDate] = React.useState(props.day);
    const [activityName, setActivityName] = React.useState('');
    const [activityDescription, setActivityDescription] = React.useState('');
    const [activityList, setActivityList] = React.useState([]);
    const [dVisibility, setDVisibility] = React.useState('hidden');

    function handleStartChange(date) {
        setStartDate(date)
    }

    function handleEndChange(date) {
        setEndDate(date)
    }

    function onStartFormSubmit(e) {
        e.preventDefault();
        console.log('start:' + startDate)
    }

    function onEndFormSubmit(e) {
        e.preventDefault();
        console.log('end:' + endDate)
    }

    function popUp() {
        if (visibility == 'hidden') {
            setStartDate(new Date());
            setVisibility('visible')
        }
        else {
            setVisibility('hidden')
        }

        // setStartDate(props.day);
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
        // setStartDate(props.day);
        // setStartDate(new Date());
        // setEndDate(new Date());
        setEndDate(props.day)
        setActivityName('');
        setActivityDescription('');
    }

    function createActivity() {
        // setStartDate(props.day);

        let activity = {
            name: activityName,
            startDate: startDate,
            endDate: endDate,
            description: activityDescription
        }
        setActivityList([...activityList, activity])
        setEndDate(props.day)
        // setEndDate(new Date());
        setActivityName('');
        setActivityDescription('');
        console.log(activityList);
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
                    for (let i = 0; i < activityList.length; i++) {
                        if (activityList[i].startDate.getTime() === day.date.getTime() || activityList[i].endDate.getTime() === day.date.getTime()) {
                            aName.push(activityList[i])
                            console.log('name: ' + activityList[i].name)
                        }
                    }
                    return (
                        <div className={"calendar-day" + (day.currentMonth ? " current" : "") + (day.selected ? " selected" : "")}
                            onClick={() => { props.changeCurrentDate(day); clearActivity(); popUp(); }} key={"calendar-day" + day.number + day.currentMonth + (day.selected ? " selected" : "")}>
                            <div id="day-number">{day.number}
                                <section className='activities-section'>
                                    {
                                        aName.map((activity) => {
                                            return (
                                                <section>
                                                    <p onClick={descriptionPopUp}style={{}}>{activity.name}</p>
                                                    <span className="popupDescription" id="myDescription" style={{ visibility: dVisibility}}>
                                                        <button onClick={descriptionPopUp}>X</button>
                                                        {activity.description}
                                                    </span>
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
            <button onClick={prevClicked}>Prev</button>
            <button onClick={nextClicked}>Next</button>
        </div>
    )
}

export default CalendarDays;