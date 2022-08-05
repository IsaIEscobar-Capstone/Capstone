import './App.css';
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../Home/Home";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Dashboard from "../Dashboard/Dashboard";
import Trip from "../Trip/Trip";
import Activities from "../Activities/Activities"
import Hotels from "../Hotels/Hotels";
import Gallery from "../Gallery/Gallery";

function App() {
  const [signUpErrorMessage, setSignUpErrorMessage] = React.useState("");
  const [signInErrorMessage, setSignInErrorMessage] = React.useState("");
  const [currentRoute, setCurrentRoute] = React.useState("/");
  const [currentGallery, setCurrentGallery] = React.useState([]);

  function handleSignUpErrorMessage(message) {
    setSignUpErrorMessage(message);
  }
  function handleSignInErrorMessage(message) {
    setSignInErrorMessage(message);
  }
  function handleCurrentRoute(route) {
    setCurrentRoute(route)
  }
  function handleCurrentGallery(gallery) {
    setCurrentGallery(gallery)
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
                  currentRoute={currentRoute}
                  handleCurrentRoute={handleCurrentRoute}
                />
              }
            />
            <Route
              path="/users/dashboard"
              element={<Dashboard/>}
            />
            <Route
              path="/users/trip"
              element={<Trip
                currentGallery={currentGallery}
                handleCurrentGallery={handleCurrentGallery}
              />}
            />
            <Route 
            path="/users/activitySearch"
            element={
              <Activities/>
            }
            />
            <Route
              path="/users/hotels"
              element={
                <Hotels/>
              }
            />
            <Route 
            path="/users/gallery"
            element={
              <Gallery
              currentGallery={currentGallery}
              handleCurrentGallery={handleCurrentGallery}
              />
            }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
