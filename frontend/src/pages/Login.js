import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

import logo from "./img/logo.png"
import cover from "./img/logincover.png"
import './Login.css'

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedIfLoggedIn: false,
      isLoggedIn: null,
      username: localStorage.getItem("username"),
      lname: localStorage.getItem("lname"),
      email: localStorage.getItem("email"),
      id: localStorage.getItem("id")
    }

    this.login = this.login.bind(this);
  }

  componentDidMount() { // send POST request to check if user is logged in
    fetch("http://localhost:3001/checkifloggedin",
      {
        method: "POST",
        credentials: "include"
      })
      .then(response => response.json())
      .then(body => {
        if (body.isLoggedIn) {
          this.setState({ checkedIfLoggedIn: true, isLoggedIn: true, username: localStorage.getItem("username"),lname: localStorage.getItem("lname"), email: localStorage.getItem("email"), id: localStorage.getItem("id")});
        } else {
          this.setState({ checkedIfLoggedIn: true, isLoggedIn: false });
        }
      });
  }

  componentDidUpdate() { // send POST request to check if user is logged in
    fetch("http://localhost:3001/checkifloggedin",
      {
        method: "POST",
        credentials: "include"
      })
      .then(response => response.json())
      .then(body => {
        if (body.isLoggedIn) {
          this.setState({ checkedIfLoggedIn: true, isLoggedIn: true, username: localStorage.getItem("username"),lname: localStorage.getItem("lname"), email: localStorage.getItem("email"), id: localStorage.getItem("id")});
        } else {
          this.setState({ checkedIfLoggedIn: true, isLoggedIn: false });
        }
      });
  }

  login(e) {
    e.preventDefault();

    const credentials = {
      email: document.getElementById("email").value,
      password: document.getElementById("pass1").value
    }

    // Send a POST request
    fetch(
      "http://localhost:3001/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      })
      .then(response => response.json())
      .then(body => {
        if (!body.success) { alert("Failed to log in"); }
        else {
          // successful log in. store the token as a cookie

          const cookies = new Cookies();
          cookies.set(
            "authToken",
            body.token,
            {
              path: "localhost:3001/",
              age: 60*60,
              sameSite: "lax"
            });

            localStorage.setItem("username", body.username);
            localStorage.setItem("lname", body.lname);
            localStorage.setItem("email", body.email)
            localStorage.setItem("id", body.id);
            alert("Successfully logged in");
        }
    })
  }
 
  render() {
    if (!this.state.isLoggedIn){
      return (
        <div className="signup">
          <div className="left">
              <div className="leftTitle">
                  <img src={logo} className="logo" alt=""/>
                  <h2 className="valueProp">Continue the journey you'll never embark on alone again.</h2>
              </div>
              <img src={cover} className="cover" alt=""/>
              <h5 className="credit">Art by <a className="creditArtist" href="https://www.manypixels.co/">ManyPixels.co</a></h5>
        </div>
          <div className="right">
            <form className="signUpForm">
              <h3 className="rightTitle">Log in to Bedev</h3>
              <label>Email</label>
              <input type="email" id="email" name="email" required></input>
              <br/>
              <label>Password</label>
              <input type="password" id="pass1" name="pass1" required
              ></input>
              <br/>
              <div className="bottom">
              <button type="submit" onClick ={this.login}>Log In</button>
              <a href="/" className="signupprompt">Not a member yet?</a>
              </div>
              <h6>This site is protected by the Google Privacy Policy <br/>and Terms of Service apply.</h6>
            </form>
          </div>
        </div>
      )
    } else {
      return <Navigate to="/feed"/>
    }
  }
}