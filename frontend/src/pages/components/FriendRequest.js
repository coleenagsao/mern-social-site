import React from 'react'
import profile from "../img/profile.png";
import './FriendRequest.css'

class FriendRequests extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user : this.props.data,
            adminId: localStorage.getItem("id")
        }
        this.addFriend = this.addFriend.bind(this)
        this.deleteFriendRequest = this.deleteFriendRequest.bind(this)
    }

    addFriend(e){
        e.preventDefault();

        const user = {
            id: this.state.adminId
        }

       fetch(
            "http://localhost:3001/addFriend/" + this.state.user._id,
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
                alert("Sucessfully added "+  this.state.user.fname + this.state.user.lname);
                window.location = window.location; 
            }
            else { 
                alert("Failed to send your friend request."); 
            }
        });
    }

    
    deleteFriendRequest(e){
        e.preventDefault();

        const user = {
            id: this.state.adminId
        }

       fetch(
            "http://localhost:3001/deleteFriendRequest/" + this.state.user._id,
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
                alert("Sucessfully removed request of "+  this.state.user.fname + this.state.user.lname);
                window.location = window.location; 
            }
            else { 
                alert("Failed to send your friend request."); 
            }
        });
    }

    render(){
        return(
            <div class="friendRequest">
                <div class="friendRequestL">
                    <img class="friendRequestImg" src={profile} alt=""/>
                </div>
                <div>
                    <h3>{this.state.user.fname} {this.state.user.lname}</h3>
                    <div class="friendRequestbtns">
                        <button class="confirmbtn" onClick = {this.addFriend}>Confirm</button>
                        <button class="deletebtn" onClick = {this.deleteFriendRequest}>Delete</button>
                    </div>
                </div>
            </div>

        )
    }
}

export default FriendRequests