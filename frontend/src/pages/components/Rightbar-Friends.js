import React from 'react'
import "./Requests-Rightbar.css"
import profile from "../img/profile.png";
import "./Rightbar-Friends.css"

class Rightbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            friends: [], //once mounted, will store all user's friends
        }

        this.Friends = this.Friends.bind(this);
    }

    componentDidMount() { //sends a GET request to store user's friend to this.state.friends
        fetch("http://localhost:3001/displayFriends/" + this.props.userId)
            .then(response => response.json())
            .then(data => {
                this.setState({ friends: data });
            })
            .catch(function(err) {
                console.log(err);
                alert("FRIENDS: Error retrieving data");
            })
    }
    
    Friends(){ //iterates through all friends
        return this.state.friends.map(function(friend,index){
            return <div key={index} className="friendProfile">
                <img className="friendImg"src={profile} alt=""/>
                <h4>{friend.fname} {friend.lname}</h4>                
            </div> 
        });
    }

    render(){
        return(
            <div className="Rightbar">
                <div className="Title">
                    <h3>Contacts</h3>
                </div>
                {this.Friends()}
            </div>
        )
    }
}

export default Rightbar