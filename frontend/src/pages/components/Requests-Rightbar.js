import React from 'react'
import "./Requests-Rightbar.css"
import NotFriend from './NotFriend.js'

class Rightbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],     //stores all suggested users who user have not interacted with yet
        }

        this.Users = this.Users.bind(this);
    }

    componentDidMount() { //sends a GET request to get all users user may know
        fetch("http://localhost:3001/displayNotFriends/" + this.props.userId)
            .then(response => response.json())
            .then(data => {
                this.setState({ users: data });
            })
            .catch(function(err) {
                console.log(err);
                console.log("PEOPLE YOU MIGHT KNOW: Error retrieving data");
            })
    }
    
    Users(){
        return this.state.users.map(function(user,index){
            return <NotFriend key={index} data={user}></NotFriend> 
        });
    }

    render(){
        return(
            <div className="Rightbar">
                <div className="Title">
                    <h3>People you may know</h3>
                </div>
                {this.Users()}
            </div>
        )
    }
}

export default Rightbar
