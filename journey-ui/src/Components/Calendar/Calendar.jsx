import './Calendar.css';
import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { initializeParse } from '@parse/react';
import ChatSetUp from '../ChatSetUp/ChatSetUp';

const PARSE_LIVE_QUERY_URL = 'https://journey.b4a.io/';
const PARSE_APPLICATION_ID = 'f3uKzoRyLgM4hnYMxkTFbZr6oABcuO4kHbAxQ3Ur';
const PARSE_JAVASCRIPT_KEY = 'hJKEz9itTiqQbFq0bx5bRyO15LI95m9H44kSWLR0';

initializeParse(
  PARSE_LIVE_QUERY_URL,
  PARSE_APPLICATION_ID,
  PARSE_JAVASCRIPT_KEY,
);

function CalendarDays(props) {
  const PORT = 3001;
  const firstDayOfMonth = new Date(props.day.getFullYear(), props.day.getMonth(), 1);
  const weekdayOfFirstDay = firstDayOfMonth.getDay();
  const currentDays = [];

  const [visibility, setVisibility] = React.useState('hidden');
  const [startDate, setStartDate] = React.useState(props.day);
  const [endDate, setEndDate] = React.useState(props.day);
  const [activityName, setActivityName] = React.useState('');
  const [activityDescription, setActivityDescription] = React.useState('');
  const [dVisibility, setDVisibility] = React.useState('hidden');
  const [currentDescription, setCurrentDescription] = React.useState('');
  const [currentName, setCurrentName] = React.useState('');
  const [currentActivity, setCurrentActivity] = React.useState();
  const [doubleCheck, setDoubleCheck] = React.useState('hidden');

  // Adds activity provided
  const response = (activity) => {
    axios.post(`http://localhost:${PORT}/users/activity`, {
      tripId: localStorage.getItem('tripId'),
      activity,
    })
      .catch((error) => {
        console.log(error);
      });
  };

  // Deletes activity provided
  const responseDelete = () => {
    axios.post(`http://localhost:${PORT}/users/removeActivity`, {
      tripId: localStorage.getItem('tripId'),
      activity: currentActivity,
    })
      .catch((error) => {
        console.log(error);
      });
  };

  // Makes 'add activity' popup only visible on double click
  // so that clicking the calendar day once (to see the activity description)
  // doesn't trigger the popup
  function handleDoubleCheck() {
    if (doubleCheck === 'hidden') {
      setDoubleCheck('visible');
    } else {
      setDoubleCheck('hidden');
    }
  }

  function handleStartChange(date) {
    setStartDate(date);
  }

  function handleEndChange(date) {
    setEndDate(date);
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
      setVisibility('visible');
    } else {
      setVisibility('hidden');
    }
  }

  // Next button on calendar clicked (sets to next month)
  function nextClicked() {
    if (props.day.getMonth() < 11) {
      props.day.setMonth(parseInt(props.day.getMonth()) + 1);
    } else {
      props.day.setMonth(0);
      props.day.setFullYear(props.day.getFullYear() + 1);
    }
    const newD = {
      currentMonth: (true),
      date: (new Date(props.day)),
      month: props.day.getMonth(),
      number: props.day.getDate(),
      selected: (firstDayOfMonth.toDateString() === props.day.toDateString()),
      year: props.day.getFullYear(),
    };
    props.changeCurrentDate(newD);
  }

  // Previous button on calendar clicked (sets to previous month)
  function prevClicked() {
    if (props.day.getMonth() > 0) {
      props.day.setMonth(parseInt(props.day.getMonth()) - 1);
    } else {
      props.day.setMonth(11);
      props.day.setFullYear(props.day.getFullYear() - 1);
    }
    const newD = {
      currentMonth: (true),
      date: (new Date(props.day)),
      month: props.day.getMonth(),
      number: props.day.getDate(),
      selected: (firstDayOfMonth.toDateString() === props.day.toDateString()),
      year: props.day.getFullYear(),
    };
    props.changeCurrentDate(newD);
  }

  function clearActivity() {
    setEndDate(props.day);
    setActivityName('');
    setActivityDescription('');
  }

  function createActivity() {
    const id = String(Math.random() * 10000000) + activityName + activityDescription;

    const activity = {
      id,
      name: activityName,
      startDate,
      endDate,
      description: activityDescription,
    };
    response(activity);
    const temp = JSON.parse(localStorage.getItem('activityList'));
    temp.push(activity);
    localStorage.setItem('activityList', JSON.stringify(temp));
    setEndDate(props.day);
    setActivityName('');
    setActivityDescription('');
  }

  function deleteActivity() {
    const newAList = [];
    for (let i = 0; i < JSON.parse(localStorage.getItem('activityList')).length; i++) {
      if (JSON.parse(localStorage.getItem('activityList'))[i].id !== currentActivity.id) {
        newAList.push(JSON.parse(localStorage.getItem('activityList'))[i]);
      }
    }
    localStorage.setItem('activityList', JSON.stringify(newAList));
  }

  function descriptionPopUp() {
    if (dVisibility === 'hidden') {
      setDVisibility('visible');
    } else {
      setDVisibility('hidden');
    }
  }

  // Calculates first day to display on the Calendar,
  // (the date of the sunday before or on the start of the month).
  // Caculates out of the 42 days displayed on Calendar.
  for (let day = 0; day < 42; day++) {
    if (day === 0 && weekdayOfFirstDay === 0) {
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
    } else if (day === 0) {
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (day - weekdayOfFirstDay));
    } else {
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
    }

    const calendarDay = {
      currentMonth: (firstDayOfMonth.getMonth() === props.day.getMonth()),
      date: (new Date(firstDayOfMonth)),
      month: firstDayOfMonth.getMonth(),
      number: firstDayOfMonth.getDate(),
      selected: (firstDayOfMonth.toDateString() === props.day.toDateString()),
      year: firstDayOfMonth.getFullYear(),
    };

    currentDays.push(calendarDay);
  }

  React.useEffect(() => { setStartDate(props.day); });

  return (
    <div className="calender-chat">
      <div className="calendar-content">
        {
          // Maps over Calendar to display days and if there is an activity on
          // that day displays the activity as well
                currentDays.map((day) => {
                  const aName = [];
                  for (let i = 0; i < JSON.parse(localStorage.getItem('activityList')).length; i++) {
                    const tempStart = new Date(JSON.parse(localStorage.getItem('activityList'))[i].startDate);
                    const tempEnd = new Date(JSON.parse(localStorage.getItem('activityList'))[i].endDate);
                    if (tempStart.getFullYear() <= day.date.getFullYear()
                            && day.date.getFullYear() <= tempEnd.getFullYear()
                            && tempStart.getMonth() <= day.date.getMonth()
                            && day.date.getMonth() <= tempEnd.getMonth()
                            && tempStart.getDate(0) <= day.date.getDate()
                            && day.date.getDate() <= tempEnd.getDate()
                    ) {
                      aName.push(JSON.parse(localStorage.getItem('activityList'))[i]);
                    }
                  }
                  return (
                    <div
                      className={`calendar-day${day.currentMonth ? ' current' : ''}${day.selected ? ' selected' : ''}`}
                      onDoubleClick={() => {
                        clearActivity();
                        popUp();
                        props.changeCurrentDate(day);
                      }}
                      key={`calendar-day${day.number}${day.currentMonth}${day.selected ? ' selected' : ''}`}
                    >
                      <div id="day-number">
                        {day.number}
                        <section className="activities-section">
                          {
                                        aName.map((activity) => (
                                          <section>
                                            <p
                                              onClick={() => {
                                                descriptionPopUp();
                                                setCurrentDescription(activity.description);
                                                setCurrentName(activity.name);
                                                setCurrentActivity(activity);
                                              }}
                                              style={{
                                                border: '1px solid white',
                                                borderRadius: '7px',
                                                paddingLeft: '10px',
                                                paddingRight: '10px',
                                                color: 'white',
                                              }}
                                            >
                                              {activity.name}
                                            </p>
                                          </section>
                                        ))
                                    }
                        </section>
                      </div>
                    </div>
                  );
                })
            }
        <span
          className="popupText"
          id="myPopup"
          style={{
            position: 'absolute', visibility, marginLeft: '450px', height: '500px', width: '450px',
          }}
        >
          New Activity
          <button type="submit" onClick={() => { clearActivity(); popUp(); }}>X</button>
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
          <textarea id="activityDescription" value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)} style={{ width: '80%', height: '40%' }} />
          <button type="submit" onClick={() => { createActivity(); popUp(); }}>Create Activity</button>
        </span>
        <span
          className="popupDescription"
          id="myDescription"
          style={{
            position: 'absolute',
            visibility: dVisibility,
            color: 'black',
            minHeight: '80px',
            minWidth: '100px',
            marginLeft: '30%',
            marginTop: '20%',
            borderRadius: '10px',
          }}
        >
          <div style={{
            backgroundColor: 'white',
            paddingBottom: '10%',
            borderRadius: '10px',
          }}
          >
            <button
              type="submit"
              onClick={() => { descriptionPopUp(); }}
              style={{
                marginRight: '-80%',
                marginLeft: '10%',
                borderRadius: '30%',
                backgroundColor: 'transparent',
              }}
            >
              X
            </button>
            <p>{currentName}</p>
            <div style={{
              border: '2px solid grey',
              paddingBottom: '1vh',
              width: '80%',
              marginLeft: '10%',
              borderRadius: '10px',
            }}
            >
              <p style={{ color: 'grey', marginLeft: '-60%', fontSize: '12px' }}>Description:</p>
              <p style={{ fontFamily: 'Impact, Haettenschweiler, Arial Narrow, sans-serif' }}>{currentDescription}</p>
            </div>
            <button
              type="submit"
              onClick={() => { descriptionPopUp(); handleDoubleCheck(); }}
              style={{
                backgroundColor: 'transparent',
                borderRadius: '10px',
                marginLeft: '10%',
                marginTop: '10%',
              }}
            >
              Delete Activity
            </button>
          </div>
          <div style={{
            backgroundColor: 'white',
            visibility: doubleCheck,
            borderRadius: '10px',
            paddingLeft: '10%',
            paddingRight: '10%',
            paddingBottom: '10%',
          }}
          >
            <span className="deletePopUP" style={{ visibility: doubleCheck, color: 'black' }}>
              <button
                type="submit"
                onClick={() => {
                  handleDoubleCheck();
                }}
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: '80%',
                  marginRight: '-110%',
                }}
              >
                X
              </button>
              <p>Are you sure you want to delete this activity?</p>
              <button
                type="submit"
                onClick={() => {
                  responseDelete();
                  deleteActivity();
                  handleDoubleCheck();
                }}
                style={{ backgroundColor: 'transparent', borderRadius: '10px' }}
              >
                yes
              </button>
            </span>
          </div>
        </span>
        <button
          type="submit"
          onClick={prevClicked}
          style={{
            backgroundColor: 'transparent', color: 'white', borderRadius: '10px', border: '2px solid white',
          }}
        >
          Prev
        </button>
        <button
          type="submit"
          onClick={nextClicked}
          style={{
            backgroundColor: 'transparent', color: 'white', borderRadius: '10px', border: '2px solid white',
          }}
        >
          Next
        </button>
      </div>
      <span />
      <div className="liveChat">
        <ChatSetUp deletePopUp={props.deletePopUp} />
      </div>
    </div>
  );
}

export default CalendarDays;
