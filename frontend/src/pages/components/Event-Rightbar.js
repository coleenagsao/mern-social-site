import React from 'react'
import "./Event-Rightbar.css"
import event from "../img/event.png"

class Rightbar extends React.Component {
    render(){
        return(
            <div className="Rightbar">
                <h3 className="Events">Events</h3>
                <img className="eventImg" alt="" src={event}></img>
            </div>
        )
    }
}

export default Rightbar
