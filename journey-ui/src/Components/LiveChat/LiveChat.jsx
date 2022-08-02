// export default function LiveChat(props) {
//     return (
//         <div>
//             <p>Halo</p>
//         </div>
//     )
// }

import React, { useState } from "react";
import "./LiveChat.css";
import { Button, Input, Tooltip } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import Parse from "parse";
import { useParseQuery } from "@parse/react";

export default function LiveChat(props) {
    // Parse.enableLocalDatastore()
    // Parse.initialize("f3uKzoRyLgM4hnYMxkTFbZr6oABcuO4kHbAxQ3Ur", "hJKEz9itTiqQbFq0bx5bRyO15LI95m9H44kSWLR0");
    // Parse.serverURL = 'https://parseapi.back4app.com/'
  // State variable to hold message text input
  const [messageInput, setMessageInput] = useState("");

  // Create parse query for live querying using useParseQuery hook
  const parseQuery = new Parse.Query("Message");
  // Get messages that involve both nicknames
  parseQuery.containedIn("sender", [
    props.senderNicknameName,
    props.receiverNicknameName,
  ]);
  parseQuery.containedIn("receiver", [
    props.senderNicknameName,
    props.receiverNicknameName,
  ]);
  // Set results ordering
  parseQuery.ascending("createdAt");

  // Include nickname fields, to enable name getting on list
  parseQuery.includeAll();

  // Declare hook and variables to hold hook responses
  const { isLive, isLoading, isSyncing, results, count, error, reload } =
    useParseQuery(parseQuery, {
      enableLocalDatastore: true, // Enables cache in local datastore (default: true)
      enableLiveQuery: true, // Enables live query for real-time update (default: true)
    });

  // Message sender handler
  const sendMessage = async () => {
    try {
      const messageText = messageInput;

      // Get sender and receiver nickname Parse objects
    //   const senderNicknameObjectQuery = new Parse.Query("Nickname");
    //   senderNicknameObjectQuery.equalTo("objectId", props.senderNicknameId);
      let senderNicknameObject = props.senderNicknameName
    //   const receiverNicknameObjectQuery = new Parse.Query("Nickname");
    //   receiverNicknameObjectQuery.equalTo("objectId", props.receiverNicknameId);
      let receiverNicknameObject = props.receiverNicknameName

      // Create new Message object and save it
      let Message = new Parse.Object("Message");
      Message.set("text", messageText);
      Message.set("sender", senderNicknameObject);
      Message.set("receiver", receiverNicknameObject);
      Message.save();

      // Clear input
      setMessageInput("");
    } catch (error) {
      alert(error);
    }
  };

  // Helper to format createdAt value on Message
  const formatDateToTime = (date) => {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };
  

  return (
    <div>
      <div className="flex_between">
        <h2 class="list_heading">{`${props.senderNicknameName} sending, ${props.receiverNicknameName} receiving!`}</h2>
        <Tooltip title="Reload">
          <Button
            onClick={reload}
            type="primary"
            shape="circle"
            icon={<SyncOutlined />}
          />
        </Tooltip>
      </div>
      {results && (
        <div className="messages">
          {
          results
            .sort((a, b) => a.get("createdAt") > b.get("createdAt"))
            .map((result) => (
              <div
                key={result.id}
                className={
                  result.get("sender") === props.senderNicknameName
                    ? "message_sent"
                    : "message_received"
                }
              >
                <p className="message_bubble">{result.get("text")}</p>
                <p className="message_time">
                  {formatDateToTime(result.get("createdAt"))}
                </p>
                <p className="message_name">
                  {result.get("sender")}
                </p>
              </div>
            ))}
        </div>
      )}
      <div className="new_message">
        <h2 className="new_message_title">New message</h2>
        <Input
          className="form_input"
          value={messageInput}
          onChange={(event) => setMessageInput(event.target.value)}
          placeholder={"Your message..."}
          size="large"
        />
        <Button
          type="primary"
          className="form_button"
          color={"#208AEC"}
          size={"large"}
          onClick={sendMessage}
        >
          Send message
        </Button>
      </div>
      <div>
        {isLoading && <p>{"Loading…"}</p>}
        {isSyncing && <p>{"Syncing…"}</p>}
        {isLive ? <p>{"Status: Live"}</p> : <p>{"Status: Offline"}</p>}
        {error && <p>{error.message}</p>}
        {count && <p>{`Count: ${count}`}</p>}
      </div>
    </div>
  );
};