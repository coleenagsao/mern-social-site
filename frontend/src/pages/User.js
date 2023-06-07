import React, { Component } from "react";
import { Link } from 'react-router-dom'
import profile from "./img/profile.png";
import "./User.css"

export default class UserProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fname: "", 
            lname: "",
            email: ""
        }
    }   
    
    componentDidMount() {
        const link = "http://localhost:3001/findById/" + window.location.pathname.slice(6)
        fetch(link)
            .then(response => response.json())
            .then(data => {
                this.setState({ fname: data.fname, lname: data.lname, email: data.email}); //set fname, lname, email to user's
            })
            .catch(function(err) {
                console.log(err);
                alert("USER PROFILE: Error retrieving data");
            })
    }
    
    render(){
        console.log()
        return(
            <div className="profileCard">
                    <img src={profile} alt=""/>
                    <div className="userDetails">
                        <h3>{this.state.fname} {this.state.lname}</h3>
                        <h5>{this.state.email}</h5>
                    </div>
                    <Link to={"/feed"}><button className="feed-btn"> Back</button></Link>
            </div>
        )
    }
}