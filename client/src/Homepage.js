import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import {ReactComponent as CryptoSvg} from './top_img.svg';

import "./Homepage.css";

import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";


// import your component functions for use in route links


import Login from "./Login";
import Signup from "./Signup";
import Logout from "./Logout";
import Stock from './Stock';
import StockDisplay from "./StockDisplay";






function App(props) {
  return (
    <Switch>
      <Route exact path="/">
        <Homepage changeState = {props.changeState} />
      </Route>


      <Route exact path="/portfolios" component={StockDisplay}></Route>
      <Route exact path="/coins" component={Stock}></Route>
      <Route exact path="/login" component={Login}></Route>
      <Route exact path="/signup" component={Signup}></Route>
      <Route exact path="/logout" component={Logout}></Route>


    </Switch>
  );
}



const Homepage = (props) => {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  if (localStorage.getItem("token")){
    props.changeState(true)
  }
  else{
    props.changeState(false)
  }

  return (
      <div>
      <div>
        <h2>Welcome to Crypto Portfolios!</h2>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          Start your Crypto Journey here!
        </Button>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          onClose={handleClose}
          open={Boolean(anchorEl)}
        >

        <Link className="App-link" to="/coins">
          {" "}
          <MenuItem onClick={handleClose}>List of Coins</MenuItem>{" "}
        </Link>
        <Link className="App-link" to="/portfolios">
          {" "}
          <MenuItem onClick={handleClose}>Portfolios</MenuItem>
        </Link>
      </Menu>

    </div>
    <div>
        <CryptoSvg style = {{height: 800, width:800}} />
      </div>
   </div>

  );
};

export default App;