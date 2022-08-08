import './Trip.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useEffect } from 'react';
import CalendarDays from '../Calendar/Calendar';
import { storage } from '../Firebase';

export default function Trip() {
  const [currentDay, setCurrentDay] = React.useState(new Date());
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const [currentFiles, setCurrentFiles] = React.useState(null);
  const [currentImgUrl, setCurrentImgUrl] = React.useState('');
  const [loadingPercent, setLoadingPercent] = React.useState(-1);

  const PORT = 3001;

  // Log out user
  const response = () => {
    axios.post(`http://localhost:${PORT}/users/dashboard`, {
      sessionToken: localStorage.getItem('sessionToken'),
    })
      .then((res) => {
        console.log(`sessionToken: ${res.data.sessionToken}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Gets list of trips user has access to and resets
  // activities to display to none
  const tripResponse = () => {
    axios.post(`http://localhost:${PORT}/users/tripList`, {
      username: localStorage.getItem('username'),
    })
      .then((res) => {
        localStorage.setItem('tripList', JSON.stringify(res.data.trips));
        localStorage.setItem('activityList', JSON.stringify([]));
        window.location.reload();
      })
      .catch((error) => {
        console.log(`Trip list update failed: ${error.response.data}`);
      });
  };

  // Tracks upload of images and saves loading percentage in
  // a use state to display
  useEffect(() => {
    if (currentFiles != null) {
      const imgRef = ref(storage, `images/${currentFiles.name}`);
      const uploadTask = uploadBytesResumable(imgRef, currentFiles);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );

          setLoadingPercent(percent);
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setCurrentImgUrl(url);
          });
        },
      );
    }
  }, [currentFiles]);

  const fileUpload = () => {
    axios.post(`http://localhost:${PORT}/users/uploadPhotos`, {
      tripId: localStorage.getItem('tripId'),
      imgUrl: currentImgUrl,
    });
  };
  const getPhotoList = () => {
    axios.post(`http://localhost:${PORT}/users/getPhotos`, {
      tripId: localStorage.getItem('tripId'),
    })
      .then((res) => {
        localStorage.setItem('photoList', JSON.stringify(res.data.photoList));
        window.location.reload();
      });
  };

  function changeCurrentDate(day) {
    setCurrentDay(new Date(day.year, day.month, day.number));
  }

  function onChange(e) {
    setCurrentFiles(e.target.files[0]);
  }

  return (
    <div>
      <div className="returnButtons">
        <Link
          to="/"
          onClick={response}
          id="dashLogOut"
          style={{
            textDecoration: 'none',
            color: 'white',
            border: '2px solid white',
            borderRadius: '5px',
            padding: '10px',
            marginTop: '-40px',
          }}
        >
          Log Out
        </Link>
        <Link
          to="/users/dashboard"
          onClick={tripResponse}
          id="BackToDash"
          style={{
            textDecoration: 'none',
            color: 'white',
            border: '2px solid white',
            borderRadius: '5px',
            padding: '10px',
            marginTop: '-40px',
          }}
        >
          Back To Dash
        </Link>
        <Link
          to="/users/gallery"
          onClick={() => { getPhotoList(); }}
          style={{
            textDecoration: 'none',
            color: 'white',
            border: '2px solid white',
            borderRadius: '5px',
            padding: '10px',
            marginTop: '-40px',
          }}
        >
          Go to Photo Gallery
        </Link>
        <form id="file-form" onSubmit={() => { fileUpload(); }}>
          <label
            htmlFor="photo-input"
            style={{
              color: 'white',
              border: '2px solid white',
              borderRadius: '5px',
              padding: '10px',
              marginTop: '10px',
            }}
          >
            Upload Image to Gallery
            <input
              id="photo-input"
              type="file"
              name="trip-photos"
              onChange={onChange}
              style={{
                visibility: 'hidden',
                height: '0.10px',
                width: '0.10px',
              }}
            />
          </label>
          <p style={{ visibility: (loadingPercent > -1) ? 'visible' : 'hidden' }}>
            image loading
            {' '}
            {loadingPercent}
            %
          </p>
          <input
            type="submit"
            value="Upload photo"
            style={{
              visibility: (loadingPercent === 100) ? 'visible' : 'hidden',
              color: 'black',
              border: '2px solid black',
              borderRadius: '5px',
              backgroundColor: 'transparent',
            }}
          />
        </form>

      </div>
      <div className="SearchActivities">
        <section style={{ marginBottom: '4vh' }}>
          <Link
            to="/users/hotels"
            id="hotelSearch"
            style={{
              textDecoration: 'none',
              color: 'white',
              border: '2px solid white',
              borderRadius: '5px',
              padding: '10px',
              marginRight: '-85%',
            }}
          >
            Search Hotels
          </Link>
        </section>
        <section>
          <Link
            to="/users/activitySearch"
            id="activitySearch"
            style={{
              textDecoration: 'none',
              color: 'white',
              border: '2px solid white',
              borderRadius: '5px',
              padding: '10px',
              marginRight: '-85%',
            }}
          >
            Search Flights
          </Link>
        </section>
      </div>
      <div className="Home">
        <div className="Header">
          <h2 style={{ marginTop: '-20px' }}>{localStorage.getItem('currentTrip')}</h2>
          <h2>
            {months[currentDay.getMonth()]}
            {' '}
            {currentDay.getFullYear()}
          </h2>
        </div>
        <div className="weekly-header">
          {
                        weekdays.map((weekday) => <div className="weekday" key={weekday}><p>{weekday}</p></div>)
                    }
        </div>
        <CalendarDays
          day={currentDay}
          changeCurrentDate={changeCurrentDate}
        />
      </div>
    </div>
  );
}
