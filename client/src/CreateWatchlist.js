import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
import React from "react";
import { toast } from "react-toastify";

import coins from "./constants/coins.json";



function getToken() {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken;
}

class CreateWatchList extends React.Component {
  constructor(props) {
    super(props);

    this.coins = this.getCoins.bind(this);

    this.state = {
      coin: "",
      description: "",
    };

    this.updateCoin = this.updateCoin.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  updateCoin(evt) {
    this.setState({
      coin: evt.target.value,
    });
  }
  updateDescription(evt) {
    this.setState({
      description: evt.target.value,
    });
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    if (
      this.state.coin === "" ||
      this.state.description === "" 
    ) {
      return;
    }
    try {
      console.log(this.state);
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/addtowatchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "Content-Type, Authorization",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(this.state),
      });
      if (response.status === 201) {
        toast.success("Successfully created Watchlist", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.props.history.push("/");
      } else {
        toast.error("Unable to create Watchlist!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }); //TODO: various types of errors
      }
    } catch (error) {
      toast.error("Unable to create Watchlist!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }); //TODO: various types of errors
      console.log(error);
    }
  }
  getCoins() {
    let items = [];
    items.push(<option value="default">Choose Coin</option>);
    for (let key in coins) {
      items.push(<option value={key}>{coins[key]["name"]}</option>);
      //here I will be creating my options dynamically based on
      //what props are currently passed to the parent component
    }
    console.log(items);
    return items;
  }
  
  render() {
    return (
        <div className="body">
        <h2>Create Watchlist </h2>
        <div className="workForm">
        <Form onSubmit={this.handleSubmit} style={{ height: "300px" }}>
          <Row className="align-items-center" style={{ height: "100px" ,width: "300px" }}>
            <Form.Control
              type="text"
              placeholder="Enter Coin..."
              value={this.state.coin}
              onChange={this.updateCoin}
            />
          </Row>
          <Row className="align-items-center" style={{ height: "100px" ,width: "300px" }}>
            <Form.Control
              type="text"
              as="textarea"
              placeholder="Enter Description..."
              value={this.state.content}
              style={{ height: "100px" , width: "300px"}}
              onChange={this.updateDescription}
            />
          </Row>
          <Row>
              <br />

          </Row>
          <Row className="align-items-center" style={{ marginBottom: "10px", width: "300px"}}>
            <Col>
              <FloatingLabel
                controlId="floatingSelect"
                label="Choose Coin from"
                style={{ color: "black" }}
                value={this.state.coin}
                onChange={this.updateCoin}
              >
                <Form.Select>{this.getCoins()}</Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          
          <Button type="submit" className="workForm btn_center" 
          style={{background:"#8ab0dd", color:"#ffffff", align:"center"}}>
            Submit
            
          </Button>
        
        </Form>
      </div>
      </div>
    );
  }
}

export default CreateWatchList;