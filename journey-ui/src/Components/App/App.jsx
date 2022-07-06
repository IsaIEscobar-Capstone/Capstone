import './App.css';
import * as React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
// import axios from "axios"

import Home from "../Home/Home";
import Register from "../Register/Register"
import Login from "../Login/Login"

function App() {
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
            <Register/>
          }
          />
          <Route 
          path="/users/login"
          element={
            <Login/>
          }
          />
        </Routes>
      </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
