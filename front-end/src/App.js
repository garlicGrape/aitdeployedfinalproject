import React, { useState } from "react";

import "./App.css";
import {ReactComponent as EthSvg} from './ethereum-eth-logo.svg'

// import your component functions for use in route links
import NavBar from "./NavBar";
import Homepage from "./Homepage";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      <NavBar/>
<div>
        <EthSvg style = {{height: 100, width:100}} />
      </div>
      <div className = "mainContent">
        <Homepage changeState = {setLoggedIn} state = {loggedIn} />

      </div>
    </div>
  );
}

export default App;
