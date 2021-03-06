import React from "react";
import { Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import "./NavBar.css";

const NavBar = (props) => {
  return (
    <Navbar className="color-nav" variant = "light" sticky="top" >
        <Navbar.Collapse className="justify-content-center">
            <Link className = "App-link" to="/">
                <Navbar.Brand > CRYPTO PORTFOLIOS </Navbar.Brand>
            </Link>
        </Navbar.Collapse> 
        <Navbar.Collapse className="justify-content-end">
          {!localStorage.getItem("token")? (
            <Link className = "App-link" to={{
                pathname: '/signup',
                state: {
                  changeState: props.changeState
                }
            }}>
                  <Navbar.Brand > Sign Up </Navbar.Brand>
            </Link>
          ) : (
              <Link className = "App-link" to="/logout">
                  <Navbar.Brand > Log Out </Navbar.Brand>
              </Link>
          )
          }
        </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
