import React from 'react'
import profile from "../img/profile.png";

class NotFriend extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user : this.props.data,
            adminId: localStorage.getItem("id")
        }

        this.addFriendRequest = this.addFriendRequest.bind(this)
    }
    
    addFriendRequest(e){
        e.preventDefault();

        const user = {
            id: this.state.adminId
        }

       fetch(
            "http://localhost:3001/addFriendRequest/" + this.state.user._id,
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
                alert("Sucessfully sent your friend request.");
                window.location = window.location; 
            }
            else { 
                alert("Failed to send your friend request."); 
            }
        });
    }
    
    render(){
        return(
            <div class="users">
                <div class="usersL">
                    <img class="userImg" src= {profile} alt=""/>
                    <div class="usersC">
                        <h4>{this.state.user.fname} {this.state.user.lname}</h4>
                        <span>{this.state.user.email}</span>
                    </div>
                </div>
                <div class="usersR">
                    <button class="addbtn" onClick={this.addFriendRequest}>Add Friend</button>
                </div>
            </div> 
        )
    }

}

export default NotFriend
