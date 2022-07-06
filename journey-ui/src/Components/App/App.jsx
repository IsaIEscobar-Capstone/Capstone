import './App.css';
import * as React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "../Home/Home";
import Register from "../Register/Register"
import Login from "../Login/Login"

function App() {
  const [signUpErrorMessage, setSignUpErrorMessage] = React.useState("");
  const [signInErrorMessage, setSignInErrorMessage] = React.useState("");

  function handleSignUpErrorMessage(message) {
    setSignUpErrorMessage(message);
  }
  function handleSignInErrorMessage(message) {
    setSignInErrorMessage(message);
  }

  return (
    <div className = "App">
      <BrowserRouter>
      <main>
        <Routes>
        <Route
              path="/"
              element={
                <Home/>
              }
            />
          <Route
          path="/users/register"
          element={
            <Register
              signUpErrorMessage={signUpErrorMessage}
              handleSignUpErrorMessage={handleSignUpErrorMessage}
            />
          }
          />
          <Route 
          path="/users/login"
          element={
            <Login
              signInErrorMessage={signInErrorMessage}
              handleSignInErrorMessage={handleSignInErrorMessage}
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
