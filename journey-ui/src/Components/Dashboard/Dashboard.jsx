/* eslint-disable react/no-unescaped-entities */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-no-bind */
import './Dashboard.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router';
import DeletePopup from '../DeletePopup/DeletePopup';

// Logs out user
export default function Dashboard() {
  const navigate = useNavigate();
  const [visibility, setVisibility] = React.useState('hidden');
  const PORT = 3001;

  const response = () => {
    axios.post(`http://localhost:${PORT}/users/dashboard`, {
      sessionToken: localStorage.getItem('sessionToken'),
    })

      .then((res) => {
        console.log(res.data.sessionToken);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  // Gets object ID and trip name of trip clicked on
  const calResponse = () => {
    axios.post(`http://localhost:${PORT}/users/trip`, {
      vacationName: document.getElementById('tripName').value,
      username: localStorage.getItem('username'),
    })
      .then((res) => {
        localStorage.setItem('tripId', res.data.tripId);
        localStorage.setItem('currentTrip', document.getElementById('tripName').value);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Cets existing activity list from trip clicked on
  const responseList = (tripId) => {
    axios.post(`http://localhost:${PORT}/users/calendar`, {
      tripId,
    })
      .then((res) => {
        localStorage.setItem('activityList', JSON.stringify(res.data.activities));
        navigate('/users/trip');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Shares trip/calendar with the user specified
  const responseShare = (tripId, tripName, user) => {
    axios.post(`http://localhost:${PORT}/users/share`, {
      user,
      tripId,
      tripName,
    })
      .catch((error) => {
        console.log(error);
      });
  };

  // Deletes trip/calendar object
  const responseDelete = (tripId) => {
    axios.post(`http://localhost:${PORT}/users/deleteCalendar`, {
      tripId,
      username: localStorage.getItem('username'),
    })
      .catch((error) => {
        console.log(error);
      });
  };

  function deleteFromList(tripId) {
    const temp = JSON.parse(localStorage.getItem('tripList')).filter((trip) => trip.id !== tripId);
    localStorage.setItem('tripList', JSON.stringify(temp));
    window.location.reload();
  }

  function calendarClicked(tripId, tripName) {
    localStorage.setItem('tripId', tripId);
    localStorage.setItem('currentTrip', tripName);
  }

  function popUp() {
    if (visibility === 'hidden') {
      setVisibility('visible');
    } else {
      setVisibility('hidden');
    }
  }

  function updateTrip() {
    const vacationName = document.getElementById('tripName').value;
    localStorage.setItem('currentTrip', vacationName);
  }

  return (
    <div>
      <Link
        to="/"
        onClick={response}
        id="logOut"
        style={{
          textDecoration: 'none',
          color: 'white',
          border: '2px solid white',
          borderRadius: '5px',
          width: '200px',
          marginRight: '90%',
        }}
      >
        Log Out
      </Link>
      <div className="Home">
        <div className="Header">
          <p>
            {localStorage.getItem('username').toUpperCase()}
            'S Trip Dashboard
          </p>
          <hr id="DashDivide" />
        </div>
        <div className="Dash">
          <div className="currentTrips">
            {
                            JSON.parse(localStorage.getItem('tripList')).map((trip) => (
                              <section key={trip.id}>
                                <button
                                  type="submit"
                                  to="/users/trip"
                                  onClick={() => {
                                    responseList(trip.id);
                                    calendarClicked(trip.id, trip.name);
                                  }}
                                  key={trip.id}
                                  style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    margin: '0.5vh',
                                    border: '2px solid white',
                                    borderRadius: '5px',
                                    width: '300px',
                                    backgroundColor: 'transparent',
                                  }}
                                >
                                  {trip.name}
                                </button>
                                <input
                                  id={`${trip.name} ${trip.id}`}
                                  placeholder="Friend Username..."
                                  type="text"
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: '2px solid white',
                                    borderRadius: '5px',
                                  }}
                                />
                                <button
                                  type="submit"
                                  onClick={() => responseShare(trip.id, trip.name, document.getElementById(`${trip.name} ${trip.id}`).value)}
                                  style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    margin: '0.5vh',
                                    border: '2px solid white',
                                    borderRadius: '5px',
                                    width: '150px',
                                    backgroundColor: 'transparent',
                                  }}
                                >
                                  Share with friend
                                </button>
                                <DeletePopup
                                  responseDelete={responseDelete}
                                  trip={trip}
                                  deleteFromList={deleteFromList}
                                />
                              </section>
                            ))
                        }
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              height: '17vh',
              width: '15vw',
              marginLeft: '26vh',
              visibility,
            }}
            >
              <span className="popupText" id="myPopup" style={{ visibility, backgroundColor: 'white' }}>
                Name Your Trip
                <button
                  type="submit"
                  onClick={popUp}
                  style={{
                    backgroundColor: 'transparent',
                    borderRadius: '60%',
                    marginRight: '-2.5vw',
                    marginLeft: '2vw',
                  }}
                >
                  X
                </button>
                <section>
                  <input
                    id="tripName"
                    placeholder="Vacation..."
                    type="text"
                    style={{
                      marginTop: '2.5vh',
                      padding: '5px',
                      marginBottom: '1vh',
                    }}
                  />
                </section>
                <section>
                  <Link
                    to="/users/trip"
                    onClick={() => { calResponse(); updateTrip(); }}
                    id="newTrip"
                    style={{
                      backgroundColor: 'transparent',
                      textDecoration: 'none',
                      color: 'black',
                      border: '2px solid black',
                      borderRadius: '5px',
                      height: '30px',
                      width: '200px',
                    }}
                  >
                    New Trip
                  </Link>
                </section>
              </span>
            </div>
            <button
              type="submit"
              className="popUp"
              onClick={popUp}
              style={{
                backgroundColor: 'transparent',
                marginLeft: '15vw',
                textDecoration: 'none',
                color: 'white',
                border: '2px solid white',
                borderRadius: '5px',
                height: '20px',
                width: '200px',
                marginTop: '10%',
                padding: '2%',
                paddingBottom: '5%',
                marginBottom: '5%',
              }}
            >
              New Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
