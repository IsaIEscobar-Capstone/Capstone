import React, { useState } from "react";
import "./ChatSetUp.css";
import LiveChat from "../LiveChat/LiveChat"
import axios from "axios";
import { Button, Input } from "antd";

export default  function ChatSetUp() {
  // State variables holding input values and results
  const [receiverNicknameInput, setReceiverNicknameInput] = useState("");
  const [receiverNickname, setReceiverNickname] = React.useState(null);

    const checkUser = () => {
        const receiverNicknameName = receiverNicknameInput;
        const PORT = 3001
        axios.post(`http://localhost:${PORT}/users/chatCheck`, {
            trip_id: localStorage.getItem('trip_id'),
            user: receiverNicknameName
        })

            .then(function (response) {
                console.log(response.data.access)
                if (receiverNicknameName === null || response.data.access === false) {
                    alert("Please choose traveler with trip access to start Live Chat");
                    return false;
                  }
                  setReceiverNickname(receiverNicknameName)
            })

            .catch(function (error) {
                return false
            })
    }
  return (
    <div>
      <div className="header">
        <p>Live Chat</p>
      </div>
      <div className="container">
          <div>
            <Input
              className="form_input"
              value={receiverNicknameInput}
              onChange={(event) => setReceiverNicknameInput(event.target.value)}
              placeholder={"Receiver username"}
              size="large"
            />
            <Button
              type="primary"
              className="form_button"
              color={"#208AEC"}
              size={"large"}
              onClick={checkUser}
            >
              Start live chat
            </Button>
          </div>
          {receiverNickname !== null && (
          <LiveChat
            senderNicknameName={localStorage.getItem('username')}
            receiverNicknameName={receiverNickname}
          />
        )}
      </div>
    </div>
  );
};