import React from 'react'
import "./Sidebar.css"
import FriendRequest from './FriendRequest'

import profile from "../img/profile.png"
import friend from "../img/friendIcon.png"
import mission from "../img/groupIcon.png"
import tag from "../img/tagIcon.png"

class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            friendRequests: [],     //once mounted, will store current user's pending friend requests
        }

        this.friendRequests = this.friendRequests.bind(this);
    }

    componentDidMount() { //sends a GET request for the friend requests
        fetch("http://localhost:3001/displayFriendRequests/" + this.props.userId)
            .then(response => response.json())
            .then(data => {
                this.setState({ friendRequests: data});
            })
            .catch(function(err) {
                console.log(err);
                console.log("FRIEND REQUESTS: Error retrieving data");
            })
    }

    friendRequests(){ //iterates through each friend request and displays a FriendRequest component
        if (this.state.friendRequests != 0){
            return this.state.friendRequests.map(function(friendRequest,index){
                return <FriendRequest key={index} data={friendRequest}></FriendRequest> 
            });
        }
    }

    render(){
        return (
            <div className="Sidebar">
                <div className="userProfile">
                    <img className="userImg"src={profile} alt=""/>
                    <div className="userInfo">
                        <h3>{this.props.fname} {this.props.lname}</h3>
                        <h5>{this.props.email}</h5>
                    </div>
                </div>
                <hr className = "sidebarHr"/>
                <div class = "sidebarShortcuts">
                    <h3>Your shortcuts</h3>
                    <nav>
                        <ul class="sidebarLinks">
                            <li class="SidebarLink"><img src={friend} alt=""/>
                            <h4 class = "SidebarLinkName">Friends</h4></li> 
                            <li class="SidebarLink"><img src={mission} alt=""/>
                            <h4 class = "SidebarLinkName">Listings</h4></li> 
                            <li class="SidebarLink"><img src={tag} alt=""/>
                            <h4 class = "SidebarLinkName">Tags</h4></li> 
                        </ul>
                    </nav>
                </div>
                <hr className = "sidebarHr"/>
                <div class = "sidebarShortcuts">
                    <h3>Trending Tags</h3>
                    <h4 className = "tags"> #venture-capital #tech-news #startup #flutter #web3 #career #automation #ecommerce #agile #ethics</h4>
                </div>
                <hr className = "sidebarHr"/>
                <div className="friendContainer">
                    <h3 className="friendTitle">Friend Requests</h3>
                    {this.friendRequests()} 
                <h6 className="Ad">Privacy· Terms · Cookies · Bookmark © 2019</h6>
                </div>
            </div>
        )
    }
}

export default Sidebar;