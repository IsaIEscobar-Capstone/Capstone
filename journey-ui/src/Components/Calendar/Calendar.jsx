import "./Calendar.css";
import * as React from "react";

function CalendarDays(props) {
    let firstDayOfMonth = new Date(props.day.getFullYear(), props.day.getMonth(), 1);
    let weekdayOfFirstDay = firstDayOfMonth.getDay();
    let currentDays = [];

    const [visibility, setVisibility] = React.useState('hidden');

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
            props.day.setFullYear(props.day.getFullYear() -1)
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
                    onClick={() => props.changeCurrentDate(day)} key={"calendar-day" + day.number + day.currentMonth + (day.selected ? " selected" : "")}>
                <p id="day-number">{day.number}</p>
            </div>
            )
        })
        }
        <button onClick={prevClicked}>Prev</button>
        <button onClick={nextClicked}>Next</button>
      </div>
    )
  }
  
  export default CalendarDays;