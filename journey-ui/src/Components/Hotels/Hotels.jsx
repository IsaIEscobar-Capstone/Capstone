import './Hotels.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Hotels() {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [hotelDetails, setHotelDetails] = React.useState([]);
  const [visibility, setVisibility] = React.useState('hidden');
  const [activityName, setActivityName] = React.useState('');
  const [activityDescription, setActivityDescription] = React.useState('');
  const [currentHotel, setCurrentHotel] = React.useState();
  const [isLoading, setIsLoading] = React.useState('hidden');
  const PORT = 3001;

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

  const detailedResponse = (location, id) => {
    axios.get('https://hotels-com-provider.p.rapidapi.com/v1/hotels/search', {
      params: {
        checkin_date: location.startDate,
        checkout_date: location.endDate,
        sort_order: 'STAR_RATING_HIGHEST_FIRST',
        destination_id: id,
        adults_number: location.numAdults,
        locale: 'en_US',
        currency: 'USD',
        price_min: location.priceMin,
        price_max: location.priceMax,
        page_number: '1',
      },
      headers: {
        'X-RapidAPI-Key': 'c23bacec5fmsh0cbe448beb1c0efp1ff928jsna6b98a7788ff',
        'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com',
      },
    }).then((response) => {
      setHotelDetails(response.data.searchResults.results);
      setIsLoading('hidden');
    });
  };

  const hotelResponse = (location) => {
    setIsLoading('visible');
    axios.get('https://hotels-com-provider.p.rapidapi.com/v1/destinations/search', {
      params: {
        query: location.city,
        currency: 'USD',
        locale: 'en_US',
      },
      headers: {
        'X-RapidAPI-Key': 'c23bacec5fmsh0cbe448beb1c0efp1ff928jsna6b98a7788ff',
        'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com',
      },
    }).then((response) => {
      detailedResponse(location, response.data.suggestions[0].entities[0].destinationId);
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

  function createActivity(hotel) {
    const id = String(Math.random() * 10000000) + activityName + activityDescription;
    const address = hotel.address.streetAddress;
    const price = `${hotel.ratePlan.price.current} a night`;

    const activity = {
      id,
      name: activityName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description: `Name: ${hotel.name}\nAddress: ${address}\nPrice: ${price}\n${activityDescription}`,
    };
    addActivity(activity);
    const temp = JSON.parse(localStorage.getItem('activityList'));
    temp.push(activity);
    localStorage.setItem('activityList', JSON.stringify(temp));
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

  function dateFormat2(num) {
    if (num < 10) {
      return `0${num}`;
    }
    return num;
  }

  function searchHotel() {
    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();
    const startStringDate = String(`${startDate.getFullYear()}-${dateFormat2(startMonth)}-${dateFormat2(startDay)}`);

    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    const endStringDate = String(`${endDate.getFullYear()}-${dateFormat2(endMonth)}-${dateFormat2(endDay)}`);

    const location = {
      city: document.getElementById('location').value,
      startDate: startStringDate,
      endDate: endStringDate,
      numAdults: document.getElementById('traveler-number').value,
      priceMin: document.getElementById('price-min').value,
      priceMax: document.getElementById('price-max').value,
    };
    hotelResponse(location);
  }

  function bringPopUp() {
    const element = document.getElementById('popupText');
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
      <p style={{ fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif', fontSize: '20px' }}>Find Your Perfect Hotel</p>
      <div className="inputs">
        <input
          id="location"
          type="text"
          placeholder="Location"
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
              selected={startDate}
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
              selected={endDate}
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
        <input
          id="price-min"
          type="number"
          min="0"
          placeholder="Minimum Price"
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            borderRadius: '10px',
            border: '2px solid white',
          }}
        />
        <input
          id="price-max"
          type="number"
          min="0"
          placeholder="Maximum Price"
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            borderRadius: '10px',
            border: '2px solid white',
          }}
        />
        <button
          type="submit"
          onClick={() => { searchHotel(); }}
          style={{
            backgroundColor: 'transparent',
            color: 'grey',
            borderRadius: '10px',
            border: '2px solid grey',
          }}
        >
          Search Hotel
        </button>
      </div>
      <span
        id="popupText"
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
            backgroundColor: 'transparent',
            borderRadius: '80%',
            marginLeft: '33%',
            marginRight: '-38%',
          }}
          onClick={() => { popUp(); }}
        >
          X
        </button>
        <section>
          <input id="activityName" value={activityName} onChange={(e) => setActivityName(e.target.value)} type="text" />
        </section>
        <p>Description:</p>
        <textarea id="activityDescription" value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)} type="txt" style={{ width: '80%', height: '40%' }} />
        <button
          type="submit"
          style={{
            backgroundColor: 'transparent',
            borderRadius: '10px',
            marginTop: '10%',
          }}
          onClick={() => { createActivity(currentHotel); popUp(); }}
        >
          Create Activity

        </button>
      </span>
      <p style={{ visibility: isLoading, color: 'white' }}>Loading...</p>
      <section className="hotelDisplay">
        {
                    hotelDetails.map((hotel) => (
                      <div
                        key={hotel.id}
                        style={{
                          padding: '2%',
                          margin: '2%',
                          border: '2px solid white',
                          borderRadius: '10px',
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                        }}
                      >
                        <div syle={{ justifyContent: 'center' }}>
                          <img src={hotel.optimizedThumbUrls.srpDesktop} alt="hotel" style={{ borderRadius: '10px' }} />
                        </div>
                        <div className="hotelAddress">
                          <div className="content">
                            <p className="innerContent">{hotel.address.streetAddress}</p>
                          </div>
                        </div>
                        <p>{hotel.name}</p>
                        <p style={{ marginBottom: '20px' }}>
                          Star Rating:
                          {hotel.starRating}
                        </p>
                        <p>
                          {hotel.ratePlan.price.current}
                          {' '}
                          a night
                        </p>
                        <div>
                          <a
                            href={`https://www.hotels.com/ho${hotel.id}`}
                            target="_blank"
                            style={{
                              textDecoration: 'none',
                              color: 'black',
                              border: '1px solid black',
                              borderRadius: '10px',
                              padding: '10px',
                              width: '30%',
                            }}
                            rel="noreferrer"
                          >
                            More Info/Booking
                          </a>
                        </div>
                        <div sylte={{ justifyContent: 'center' }}>
                          <button
                            type="submit"
                            onClick={() => {
                              popUp();
                              setCurrentHotel(hotel);
                              bringPopUp();
                            }}
                            style={{
                              backgroundColor: 'transparent',
                              border: '1px solid black',
                              borderRadius: '10px',
                              width: '20%',
                            }}
                          >
                            Add to calendar
                          </button>
                        </div>
                      </div>
                    ))
                }
      </section>
    </div>
  );
}
