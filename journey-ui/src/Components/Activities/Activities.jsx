import './Activities.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  const [isLoading, setIsLoading] = React.useState('hidden');
  const [headerVisibility, setHeaderVisibility] = React.useState('hidden');
  const PORT = 3001;

  function timeConvert(n) {
    const num = n;
    const hours = (num / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return `${rhours} hour(s) and ${rminutes} minute(s).`;
  }

  const logOut = () => {
    axios.post(`http://localhost:${PORT}/users/dashboard`, {
      sessionToken: localStorage.getItem('sessionToken'),
    })

      .then((response) => {
        console.log(`sessionToken: ${response.data.sessionToken}`);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const response = (temp) => {
    axios.get('https://skyscanner44.p.rapidapi.com/search', {
      params: {
        adults: temp.adults,
        origin: temp.origin,
        destination: temp.destination,
        departureDate: temp.departureDate,
        currency: temp.currency,
      },
      headers: {
        'X-RapidAPI-Key': 'c23bacec5fmsh0cbe448beb1c0efp1ff928jsna6b98a7788ff',
        'X-RapidAPI-Host': 'skyscanner44.p.rapidapi.com',
      },
    }).then(() => {
      axios.get('https://skyscanner44.p.rapidapi.com/search', {
        params: {
          adults: temp.adults,
          origin: temp.origin,
          destination: temp.destination,
          departureDate: temp.departureDate,
          currency: temp.currency,
        },
        headers: {
          'X-RapidAPI-Key': 'c23bacec5fmsh0cbe448beb1c0efp1ff928jsna6b98a7788ff',
          'X-RapidAPI-Host': 'skyscanner44.p.rapidapi.com',
        },
      }).then((res) => {
        const best = res.data.itineraries.buckets[0].items;
        const bestList = [];
        const fastest = res.data.itineraries.buckets[1].items;
        const fastestList = [];
        const cheapest = res.data.itineraries.buckets[2].items;
        const cheapestList = [];

        for (let i = 0; i < best.length; i++) {
          const bestTemp = {
            url: best[i].deeplink,
            price: best[i].price.formatted,
            connectionsAmount: best[i].legs[0].segments.length,
            airline: best[i].legs[0].carriers.marketing[0],
            tags: best[i].tags,
            departure: best[i].legs[0].departure,
            arrival: best[i].legs[0].arrival,
            duration: timeConvert(best[i].legs[0].durationInMinutes),
          };
          bestList.push(bestTemp);
        }
        for (let i = 0; i < fastest.length; i++) {
          const fastestTemp = {
            url: fastest[i].deeplink,
            price: fastest[i].price.formatted,
            connectionsAmount: fastest[i].legs[0].segments.length,
            airline: fastest[i].legs[0].carriers.marketing[0],
            tags: fastest[i].tags,
            departure: fastest[i].legs[0].departure,
            arrival: fastest[i].legs[0].arrival,
            duration: timeConvert(fastest[i].legs[0].durationInMinutes),
          };
          fastestList.push(fastestTemp);
        }
        for (let i = 0; i < cheapest.length; i++) {
          const cheapestTemp = {
            url: cheapest[i].deeplink,
            price: cheapest[i].price.formatted,
            connectionsAmount: cheapest[i].legs[0].segments.length,
            airline: cheapest[i].legs[0].carriers.marketing[0],
            tags: cheapest[i].tags,
            departure: cheapest[i].legs[0].departure,
            arrival: cheapest[i].legs[0].arrival,
            duration: timeConvert(cheapest[i].legs[0].durationInMinutes),
          };
          cheapestList.push(cheapestTemp);
        }

        localStorage.setItem('bestFlightDetails', bestList);
        localStorage.setItem('fastestFlightDetails', fastestList);
        localStorage.setItem('cheapestFlightDetails', cheapestList);
        setBestFlightDetails(bestList);
        setFastestFlightDetails(fastestList);
        setCheapestFlightDetails(cheapestList);
        setIsLoading('hidden');
        setHeaderVisibility('visible');
      });
    });
  };

  const addActivity = (activity) => {
    axios.post(`http://localhost:${PORT}/users/activity`, {
      tripId: localStorage.getItem('tripId'),
      activity,
    })
      .catch((error) => {
        console.log(error);
      });
  };
  function popUp() {
    if (visibility === 'hidden') {
      setVisibility('visible');
    } else {
      setVisibility('hidden');
    }
  }

  function createActivity(flight) {
    const id = String(Math.random() * 10000000) + activityName + activityDescription;

    const activity = {
      id,
      name: activityName,
      startDate: new Date(flight.departure),
      endDate: new Date(flight.arrival),
      description: activityDescription,
    };
    addActivity(activity);
    const temp = JSON.parse(localStorage.getItem('activityList'));
    temp.push(activity);
    localStorage.setItem('activityList', JSON.stringify(temp));
  }

  function handleStartChange(date) {
    setOriginDate(date);
  }

  function handleEndChange(date) {
    setDestinationDate(date);
  }

  function onStartFormSubmit(e) {
    e.preventDefault();
  }

  function onEndFormSubmit(e) {
    e.preventDefault();
  }

  function dateFormat2(num) {
    if (num < 10) {
      return `0${num}`;
    }
    return num;
  }

  function searchFlight() {
    setIsLoading('visible');
    const originMonth = originDate.getMonth() + 1;
    const originDay = originDate.getDate();
    const originStringDate = String(`${originDate.getFullYear()}-${dateFormat2(originMonth)}-${dateFormat2(originDay)}`);
    const temp = {
      adults: String(document.getElementById('traveler-number').value),
      origin: document.getElementById('origin').value,
      destination: document.getElementById('destination').value,
      departureDate: originStringDate,
      currency: 'USD',
    };
    response(temp);
  }

  function bringPopUp() {
    const element = document.getElementById('popupAdd');
    element.scrollIntoView();
  }

  return (
    <div>
      <div className="returnButtons">
        <Link
          to="/"
          onClick={logOut}
          id="dashLogOut"
          style={{
            textDecoration: 'none',
            color: 'white',
            border: '2px solid white',
            borderRadius: '5px',
            padding: '10px',
          }}
        >
          Log Out
        </Link>
        <Link
          to="/users/trip"
          id="BackToCal"
          style={{
            textDecoration: 'none',
            color: 'white',
            border: '2px solid white',
            borderRadius: '5px',
            padding: '10px',
          }}
        >
          Back To Calendar
        </Link>
      </div>
      <p>Find Your Perfect Flight</p>
      <div className="inputFields" style={{ justifyContent: 'center' }}>
        <input
          id="origin"
          type="text"
          placeholder="Origin"
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            borderRadius: '10px',
            border: '2px solid white',
          }}
        />
        <input
          id="destination"
          type="text"
          placeholder="Destination"
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            borderRadius: '10px',
            border: '2px solid white',
          }}
        />
        <form
          onSubmit={onStartFormSubmit}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            borderRadius: '10px',
            border: '2px solid white',
          }}
        >
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
        <form
          onSubmit={onEndFormSubmit}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            borderRadius: '10px',
            border: '2px solid white',
          }}
        >
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
        <input
          id="traveler-number"
          type="number"
          min="0"
          placeholder="# of travelers"
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            borderRadius: '10px',
            border: '2px solid white',
          }}
        />
        <button
          type="submit"
          onClick={() => { searchFlight(); }}
          style={{
            backgroundColor: 'transparent',
            color: 'grey',
            borderRadius: '10px',
            border: '2px solid grey',
          }}
        >
          Search Flight
        </button>
      </div>
      <span
        id="popupAdd"
        style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          position: 'absolute',
          visibility,
          height: '500px',
          width: '550px',
          marginLeft: '-200px',
        }}
      >
        New Activity
        <button
          type="submit"
          style={{
            backgroundColor: 'transparent', borderRadius: '80%', marginLeft: '33%', marginRight: '-38%',
          }}
          onClick={() => { popUp(); }}
        >
          X
        </button>
        <section>
          <input id="activityName" value={activityName} onChange={(e) => setActivityName(e.target.value)} type="text" />
        </section>
        <p>Description:</p>
        <textarea
          id="activityDescription"
          value={activityDescription}
          onChange={(e) => setActivityDescription(e.target.value)}
          type="txt"
          style={{
            width: '80%',
            height: '40%',
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: 'transparent',
            borderRadius: '10px',
            marginTop: '10%',
          }}
          onClick={() => { createActivity(currentFlight); popUp(); }}
        >
          Create Activity
        </button>
      </span>
      <p style={{ visibility: isLoading, color: 'white' }}>Loading...</p>
      <section style={{ color: 'white', visibility: headerVisibility }}>
        Best
        {
                    bestFlightDetails.map((flight) => (
                      <section style={{
                        padding: '2%',
                        margin: '2%',
                        border: '2px solid white',
                        borderRadius: '10px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        color: 'white',
                      }}
                      >
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          marginLeft: '200px',
                          marginRight: '300px',
                        }}
                        >
                          <img src={flight.airline.logoUrl} alt="airline logo" style={{ height: '70px', width: '70px' }} />
                          <p style={{ marginTop: '40px', fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}>{flight.airline.name}</p>
                        </div>
                        <p style={{ marginTop: '40px' }}>{flight.price}</p>
                        <p>
                          Departure:
                          {flight.departure}
                        </p>
                        <p>
                          {flight.connectionsAmount}
                          {' '}
                          connections
                        </p>
                        <p>
                          Arrival:
                          {flight.arrival}
                        </p>
                        <p>{flight.duration}</p>
                        <button
                          type="submit"
                          onClick={() => { popUp(); setCurrentFlight(flight); bringPopUp(); }}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid black',
                            borderRadius: '10px',
                            width: '20%',
                            marginLeft: '280px',
                          }}
                        >
                          Add to calendar
                        </button>
                        <a
                          href={flight.url}
                          target="_blank"
                          style={{
                            textDecoration: 'none',
                            color: 'black',
                            border: '1px solid black',
                            borderRadius: '10px',
                            padding: '10px',
                            width: '30%',
                            marginLeft: '250px',
                          }}
                          rel="noreferrer"
                        >
                          More Info/Booking
                        </a>
                      </section>
                    ))
                }
      </section>
      <section style={{ color: 'white', visibility: headerVisibility }}>
        Cheapest
        {
                    cheapestFlightDetails.map((flight) => (
                      <section style={{
                        padding: '2%',
                        margin: '2%',
                        border: '2px solid white',
                        borderRadius: '10px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        color: 'white',
                      }}
                      >
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          marginLeft: '200px',
                          marginRight: '300px',
                        }}
                        >
                          <img src={flight.airline.logoUrl} alt="airline logo" style={{ height: '70px', width: '70px' }} />
                          <p style={{ marginTop: '40px', fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}>{flight.airline.name}</p>
                        </div>
                        <p style={{ marginTop: '40px' }}>{flight.price}</p>
                        <p>
                          Departure:
                          {flight.departure}
                        </p>
                        <p>
                          {flight.connectionsAmount}
                          {' '}
                          connections
                        </p>
                        <p>
                          Arrival:
                          {flight.arrival}
                        </p>
                        <p>{flight.duration}</p>
                        <button
                          type="submit"
                          onClick={() => { popUp(); setCurrentFlight(flight); bringPopUp(); }}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid black',
                            borderRadius: '10px',
                            width: '20%',
                            marginLeft: '280px',
                          }}
                        >
                          Add to calendar
                        </button>
                        <a
                          href={flight.url}
                          target="_blank"
                          style={{
                            textDecoration: 'none',
                            color: 'black',
                            border: '1px solid black',
                            borderRadius: '10px',
                            padding: '10px',
                            width: '30%',
                            marginLeft: '250px',
                          }}
                          rel="noreferrer"
                        >
                          More Info/Booking
                        </a>
                      </section>
                    ))
                }
      </section>
      <section style={{ color: 'white', visibility: headerVisibility }}>
        Fastest
        {
                    fastestFlightDetails.map((flight) => (
                      <section style={{
                        padding: '2%',
                        margin: '2%',
                        border: '2px solid white',
                        borderRadius: '10px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        color: 'white',
                      }}
                      >
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          marginLeft: '200px',
                          marginRight: '300px',
                        }}
                        >
                          <img src={flight.airline.logoUrl} alt="airline logo" style={{ height: '70px', width: '70px' }} />
                          <p style={{ marginTop: '40px', fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}>{flight.airline.name}</p>
                        </div>
                        <p style={{ marginTop: '40px' }}>{flight.price}</p>
                        <p>
                          Departure:
                          {flight.departure}
                        </p>
                        <p>
                          {flight.connectionsAmount}
                          {' '}
                          connections
                        </p>
                        <p>
                          Arrival:
                          {flight.arrival}
                        </p>
                        <p>{flight.duration}</p>
                        <button
                          type="submit"
                          onClick={() => { popUp(); setCurrentFlight(flight); bringPopUp(); }}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid black',
                            borderRadius: '10px',
                            width: '20%',
                            marginLeft: '280px',
                          }}
                        >
                          Add to calendar
                        </button>
                        <a
                          href={flight.url}
                          target="_blank"
                          style={{
                            textDecoration: 'none',
                            color: 'black',
                            border: '1px solid black',
                            borderRadius: '10px',
                            padding: '10px',
                            width: '30%',
                            marginLeft: '250px',
                          }}
                          rel="noreferrer"
                        >
                          More Info/Booking
                        </a>
                      </section>
                    ))
                }
      </section>
    </div>
  );
}
