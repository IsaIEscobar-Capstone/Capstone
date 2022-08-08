import './DeletePopup.css';
import * as React from 'react';

export default function Trip(props) {
  const [dVisibility, setDVisibility] = React.useState('hidden');

  function deletePopUp() {
    if (dVisibility === 'hidden') {
      setDVisibility('visible');
    } else {
      setDVisibility('hidden');
    }
  }

  return (
    <div className="delete">
      <button
        type="submit"
        onClick={() => { deletePopUp(); }}
        style={{
          color: 'red',
          textDecoration: 'none',
          margin: '0.5vh',
          border: '2px solid red',
          borderRadius: '5px',
          width: '100px',
          backgroundColor: 'transparent',
          opacity: '0.4',
        }}
      >
        Delete Trip
      </button>
      <div className="deletePopUP" style={{ visibility: dVisibility, backgroundColor: 'white', color: 'black' }}>
        <button
          type="submit"
          onClick={() => { deletePopUp(); }}
        >
          X
        </button>
        <p>Are you sure you want to delete this trip?</p>
        <button
          type="submit"
          onClick={() => {
            props.responseDelete(props.trip.id);
            deletePopUp();
            props.deleteFromList(props.trip.id);
          }}
        >
          yes
        </button>
      </div>
    </div>
  );
}
