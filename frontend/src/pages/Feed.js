import React, { Component} from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Header from './components/Header.js'
import Sidebar from './components/Sidebar.js'
import Rightbar from './components/Event-Rightbar'
import RightbarRequest from './components/Requests-Rightbar'
import RightbarFriends from './components/Rightbar-Friends'
import Posts from './components/Posts.js'
import profile1 from "./img/profile.png"
import './Feed.css'

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedIfLoggedIn: false,
      isLoggedIn: null,
      username: localStorage.getItem("username"),
      lname: localStorage.getItem("lname"),
      email: localStorage.getItem("email"),
      id: localStorage.getItem("id"),
    }

    this.logout = this.logout.bind(this);
    this.createPost = this.createPost.bind(this);
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

  createPost(e){ //function that sends a POST request to add a post 
    e.preventDefault();

    const post = {                                          //creates user object to be sent as req.body
      author: this.state.id, 
      content: document.getElementById("content").value,
    }
    
    fetch(
      "http://localhost:3001/createPost",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(post)
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) { 
          console.log("CREATE POST: Successfully saved post"); 
          window.location = window.location;
        }
        else { 
          console.log("CREATE POST: Failed to save post"); 
        }
      });
  }

  logout(e) {
    e.preventDefault();
    
    const cookies = new Cookies();            //delete cookie with authToken
    cookies.remove("authToken");

    localStorage.removeItem("username");      //delete username in local storage
    localStorage.removeItem("lname");         //delete lname in local storage
    localStorage.removeItem("email");         //delete lname in local storage
    localStorage.removeItem("id")

    this.setState({ isLoggedIn: false });   //set the state to now not logged in
  }

  render() {
    const userId = this.state.id
    const placeholderContent = "What's on your mind, " + this.state.username + "?"

    if (!this.state.checkedIfLoggedIn) {
      return (<div></div>)                  // delay redirect/render
    }

    else {
      if (this.state.isLoggedIn) {        // if yes, render the feed page
        return (
          <div className="Homepage">
            <Header logoutbtn = {this.logout} user = {this.state.username}/>
            <div className="Home">
              <Sidebar userId = {userId} fname = {this.state.username} lname = {this.state.lname} email = {this.state.email}/>
              {/*Feed*/}
              <div className = "Feed">
                <div className = "FeedLeft">
                  <div className="NewPost">
                      <div className="NewPostContainer">
                        <div className="NewPostDetails">
                          <img className="NewPostImg" src={profile1} alt=""/>
                          <form> 
                            <label>
                              <input className="NewPostInput" id="content"type="text" placeholder= {placeholderContent}  />
                            </label>
                          </form>
                          <button type="submit" onClick ={this.createPost}>Post</button><div/>
                        </div>
                      </div>
                    </div>
                  <div className = "FeedContainer">
                  </div>
                  <Posts userId = {userId}/>
                </div>
                <div>
                  <Rightbar/>
                  <RightbarRequest userId = {userId}/>
                  <RightbarFriends userId = {userId}/>
                </div>
              </div>
              {/*Feed*/}
            </div>
          </div> 
        )
      }
      else {
        return <Navigate to="/login" />         // redirect
      }
    }
  }
}

