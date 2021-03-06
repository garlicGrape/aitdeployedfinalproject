import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "./Signup.css";
import logo from "./bitcoin-3089728__340.webp";
const Login = (props) => {
  const [status, setStatus] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // if the user is logged-in, save the token to local storage
    if (status.success && status.token) {
      localStorage.setItem("token", status.token); // store the token into localStorage
      localStorage.setItem("user", status.username);
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // create an object with the data we want to send to the server
      const requestData = {
        username: e.target.username.value, // gets the value of the field in the submitted form with name='username'
        password: e.target.password.value, // gets the value of the field in the submitted form with name='password',
      };
      // send the request to the server api to authenticate
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/login`,
        requestData
      );
      // store the response data into the data state variable
      setStatus(response.data);
    } catch (err) {
      // throw an error
      setErrorMessage("You entered invalid credentials.");
    }
  };

  if (!status.success)
    return (
      <div>
        <div className="content">
          <h1>CRYPTO PORTFOLIOS Log in</h1>
          <p>{errorMessage}</p>
          <p> {status.message} </p>
          <form onSubmit={handleSubmit}>
            <label>Username: </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username..."
            />
            <br />
            <br />
            <label>Password: </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password..."
            />
            <br />
            <br />
            <input type="submit" value="Log In" />
          </form>
        </div>
        <div className="content">
          <img src={logo} alt="Bitcoin" height="250" width="400" />
        </div>
      </div>
    );
  // otherwise, if the user has successfully logged-in, redirect them to a different page
  // in this example, we simply redirect to the home page, but a real app would redirect to a page that shows content only available to logged-in users
  else return <Redirect to="/" />;
};

export default Login;
