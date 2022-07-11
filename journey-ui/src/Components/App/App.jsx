import './App.css';
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../Home/Home";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Dashboard from "../Dashboard/Dashboard";
import Trip from "../Trip/Trip";

function App() {
  const [signUpErrorMessage, setSignUpErrorMessage] = React.useState("");
  const [signInErrorMessage, setSignInErrorMessage] = React.useState("");
  const [sessionToken, setSessionToken] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [currentRoute, setCurrentRoute] = React.useState("/");

  function handleSignUpErrorMessage(message) {
    setSignUpErrorMessage(message);
  }
  function handleSignInErrorMessage(message) {
    setSignInErrorMessage(message);
  }
  function handleSessionToken(token) {
    setSessionToken(token);
  }
  function handleUsername(username) {
    setUsername(username);
  }
  function handleCurrentRoute(route) {
    setCurrentRoute(route)
  }

  return (
    <div className="App">
      <BrowserRouter>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home />
              }
            />
            <Route
              path="/users/register"
              element={
                <Register
                  signUpErrorMessage={signUpErrorMessage}
                  handleSignUpErrorMessage={handleSignUpErrorMessage}
                  sessionToken={sessionToken}
                  handleSessionToken={handleSessionToken}
                  username={username}
                  handleUsername={handleUsername}
                  currentRoute={currentRoute}
                  handleCurrentRoute={handleCurrentRoute}
                />
              }
            />
            <Route
              path="/users/login"
              element={
                <Login
                  signInErrorMessage={signInErrorMessage}
                  handleSignInErrorMessage={handleSignInErrorMessage}
                  sessionToken={sessionToken}
                  handleSessionToken={handleSessionToken}
                  username={username}
                  handleUsername={handleUsername}
                  currentRoute={currentRoute}
                  handleCurrentRoute={handleCurrentRoute}
                />
              }
            />
            <Route
              path="/users/dashboard"
              element={<Dashboard
                username={username}
                sessionToken={sessionToken}
                handleSessionToken={handleSessionToken}
              />}
            />
            <Route
              path="/users/trip"
              element={<Trip/>}
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
