import "./DeletePhoto.css";
import * as React from "react";

export default function DeletePhoto(props) {
    const [visibility, setVisibility] = React.useState('hidden');


    function deletePopUp() {
        if (visibility === 'hidden') {
            setVisibility('visible')
        }
        else {
            setVisibility('hidden')
        }
    }

    function deleteFromList(photoLink) {
        let temp = JSON.parse(localStorage.getItem("photoList")).filter(photo => photo != photoLink)
        localStorage.setItem("photoList", JSON.stringify(temp));
        window.location.reload()
    }

    return (
        <div className="delete">
        <button onClick={() => {deletePopUp()}} style={{ color: 'red', textDecoration: 'none', margin: '0.5vh', border: '2px solid red', borderRadius: '5px', width: '100px' , backgroundColor: 'transparent', opacity: '0.4'}}>Delete Photo</button>
        <div className="deletePopUP" style={{ visibility: visibility , backgroundColor: "white", color: "black"}}>
        <button onClick={() => {deletePopUp()}}>X</button>
        <p>Are you sure you want to delete this photo?</p>
        <button onClick={() => {props.responseDelete(props.photoLink); deletePopUp(); deleteFromList(props.photoLink);}}>yes</button>
        </div>
        </div>
    )
}