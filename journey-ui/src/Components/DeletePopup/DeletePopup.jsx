import "./DeletePopup.css";
import * as React from "react";

export default function Trip(props) {
    const [dVisibility, setDVisibility] = React.useState('hidden');


    function deletePopUp() {
        if (dVisibility === 'hidden') {
            setDVisibility('visible')
        }
        else {
            setDVisibility('hidden')
        }
    }

    return (
        <section>
        <button onClick={() => {deletePopUp()}}>Delete Trip</button>
        <div className="deletePopUP" style={{ visibility: dVisibility , backgroundColor: "white", color: "black"}}>
        <button onClick={() => {deletePopUp()}}>X</button>
        <p>Are you sure you want to delete this trip?</p>
        <button onClick={() => {props.responseDelete(props.trip.id); deletePopUp(); props.deleteFromList(props.trip.id);}}>yes</button>
        </div>
        </section>
    )
}