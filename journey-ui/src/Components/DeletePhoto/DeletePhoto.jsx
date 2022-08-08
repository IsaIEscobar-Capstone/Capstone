import './DeletePhoto.css';
import * as React from 'react';

export default function DeletePhoto(props) {
  const [visibility, setVisibility] = React.useState('hidden');

  function deletePopUp() {
    if (visibility === 'hidden') {
      setVisibility('visible');
    } else {
      setVisibility('hidden');
    }
  }

  function deleteFromList(photoLink) {
    const temp = JSON.parse(localStorage.getItem('photoList')).filter((photo) => photo !== photoLink);
    localStorage.setItem('photoList', JSON.stringify(temp));
    window.location.reload();
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
        Delete Photo
      </button>
      <div
        className="deletePopUP"
        style={{
          visibility,
          backgroundColor: 'white',
          color: 'black',
          borderRadius: '10px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '13fr 1fr' }}>
          <p>Are you sure you want to delete this photo?</p>
          <button
            type="submit"
            onClick={() => { deletePopUp(); }}
            style={{
              backgroundColor: 'transparent',
              border: '2px solid black',
              borderRadius: '60%',
              width: '30px',
            }}
          >
            X
          </button>
        </div>
        <button
          type="submit"
          onClick={() => {
            props.responseDelete(props.photoLink);
            deletePopUp();
            deleteFromList(props.photoLink);
          }}
          style={{
            backgroundColor: 'transparent',
            border: '2px solid black',
            borderRadius: '5px',
            width: '40px',
          }}
        >
          yes
        </button>
      </div>
    </div>
  );
}
