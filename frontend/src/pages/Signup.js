import React, { Component } from "react";
import logo from "./img/logo.png"
import cover from "./img/cover.png"
import './Signup.css'

//to check if sign up button will be enabled
var isPasswordValid = false;
var isPasswordCheckValid = false;

//function that check if it has at least 8 characters, 1 number, 1 lowercase letter, and 1 uppercase letter.
const validatePassword = (pass1) =>{                                
    let hasNum = false; let hasUppercase = false; let hasLowercase = false;
    
    if (pass1.length >= 8){
        for (var i = 0; i < pass1.length; i++){                     //iterates through each char
            var ch = pass1.charAt(i);
            if (!isNaN(ch)) hasNum = true;                          //checks for a number
            else if (ch != ch.toLowerCase()) hasUppercase = true;   //checks for an uppercase character
            else if (ch == ch.toLowerCase()) hasLowercase = true;   //chcecks for a lowercase character
        }
        if (hasNum === true && hasUppercase === true && hasLowercase === true) return true; 
        else return false
    } else return false;
}

export default class Signup extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      password: "",
      passwordCheck: ""
    }

    this.handlePassword = this.handlePassword.bind(this)
    this.handleCheckPassword = this.handleCheckPassword.bind(this)

    this.signup = this.signup.bind(this);
  }

  signup(e) {
    e.preventDefault();
    
    const user = {
      fname: document.getElementById("fname").value,
      lname: document.getElementById("lname").value,
      email: document.getElementById("email").value,
      password: document.getElementById("pass1").value
    }

    // send a POST request to localhost:3001/signup
    fetch(
      "http://localhost:3001/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) { 
          alert("Successfully saved user");
          window.location = window.location; 
        }
        else { 
          alert("Failed to save user"); 
        }
      });

      
  }
  //method that handles when there is change on password input field
  handlePassword(e){
    this.setState({password: e.target.value})
    
    if(validatePassword(e.target.value)){ //checks if password is valid
        document.getElementById("passwordError").innerHTML = "" //if yes, there is no error
        isPasswordValid = true; 

        //for repeat password is filled but password was accidentally erased even if validated before
        if(this.state.passwordCheck != ""){ //if there is content, checks if matching
            if (e.target.value == this.state.password){
                console.log("Same password!")
                document.getElementById("passwordNotMatching").innerHTML = ""
                isPasswordCheckValid = true;
            } else{
                console.log("Passwords are not matching")
                document.getElementById("passwordNotMatching").innerHTML = "Your password and confirmation password do not match." 
                isPasswordCheckValid = false;
            }
        }
    } else{ //if there is, an error message below the input field appears
        document.getElementById("passwordError").innerHTML = "Your password should have at least 8 characters, 1 number lowercase letter, <br/> and 1 uppercase letter."      
        isPasswordValid = false;      
    }
  }

  //method that handles when there is change on repeat password input field
  handleCheckPassword(e){
      if (this.state.password != ""){ //checkPassword will only be enabled if password field is not empty
          this.setState({passwordCheck: e.target.value})

          //repeat password will only be validated once password was validated and repeat pass not empty
          if (validatePassword(this.state.password) && this.state.passwordCheck != ""){
              if (e.target.value == this.state.password){ //checks if repeatp is the same with the validated
                  console.log("Same password!")
                  document.getElementById("passwordNotMatching").innerHTML = ""
                  isPasswordCheckValid = true;
              } else{
                  console.log("Passwords are not matching")
                  document.getElementById("passwordNotMatching").innerHTML = "Your password and confirmation password do not match."
                  isPasswordCheckValid = false; 
              }
          }
      }
  }
 
  render() {
    const isEnabled = isPasswordValid == true && isPasswordCheckValid == true;

    return (
      <div className="signup">
        <div className="left">
            <div className="leftTitle">
                <img src={logo} className="logo" alt=""/>
                <h2 className="valueProp">Because life's too short for a journey you'll embark on alone.</h2>
            </div>
            <img src={cover} className="cover" alt=""/>
            <h5 className="credit">Art by <a className="creditArtist" href="https://www.manypixels.co/">ManyPixels.co</a></h5>
      </div>
        <div className="right">
          <form className="signUpForm">
            <h1 className="rightTitle">Create your <br/>Bedev Account</h1>
            <div className="partners">
              <div className="partner">
                <label>First Name</label>
                <input type="text" id="fname" name="fname" required></input>
              </div>
              <div className="partner">
                <label>Last Name</label>
                 <input type="text" id="lname" name="lname" required></input>
              </div>                            
              <br/>
            </div>
            <br/>
            <label>Email</label>
            <input type="email" id="email" name="email" required></input>
            <br/>
            <label>Password</label>
            <input type="password" id="pass1" name="pass1" required
            value={this.state.password}
            onChange={this.handlePassword}
            ></input>
            <p id="passwordError" className="error"></p>
            <br/>
            <label>Repeat Password</label>
            <input className="password" type="password"  name="pass2" required
            value={this.state.passwordCheck}
            onChange={this.handleCheckPassword}
            ></input>
            <p id="passwordNotMatching" className="error"></p>
            <br/>
            <div className="bottom">
              <button type="submit" disabled={!isEnabled} onClick ={this.signup}>Sign Up</button>
              <a href="/login" className="signinprompt">Already have an account?</a>
            </div>
            <h6>This site is protected by the Google Privacy Policy <br/>and Terms of Service apply.</h6>
          </form>
        </div>
      </div>
    )
  }
}