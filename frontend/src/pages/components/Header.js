import React from 'react'
import Searchbar from './Searchbar.js'
import logo from "../img/logoColored.png"
import "./Header.css"

class Header extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            users: []     //contain all the users in database for the searchbar
        }
    }

    componentDidMount() { //store all users data in users
        fetch("http://localhost:3001/allUsers/")
            .then(response => response.json())
            .then(data => {
                this.setState({ users: data });
            })
            .catch(function(err) {
                console.log(err);
                console.log("READING USERS: Error retrieving data");
            })
    }

    render(){
        const logoutbtn = this.props.logoutbtn
        return (
            <div className="header">
                <div className="headerLeft">
                    <img className="logoImg" src = {logo} alt=""/>
                    <h2 className="logoName">Bedev</h2>
                </div>
                <div className="headerCenter"></div>
                <div className="headerRight">
                    <div className="headerRightContainer">
                        <Searchbar data={this.state.users}/>
                        <h4 className="headerUsername"> {this.props.user} </h4>
                        <i id="logoutbtn" class="fa-solid fa-arrow-right-from-bracket" onClick={logoutbtn}></i>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;