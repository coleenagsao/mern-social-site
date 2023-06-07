import React, {useState} from 'react'
import { Link } from "react-router-dom";
import './Searchbar.css'

function Searchbar({ data}){
    const [matchedData, setMatchedData] = useState([]);

    const handleMatch = (e) => {
        const searchInput = e.target.value              //store user input in search input

        const newMatch = data.filter((value) => {
            if (searchInput.includes(" ")){             //checks if there are 2 or more words in input
                var newArr = searchInput.split(" ");    //if there is, split and store in array 
                return value.fname.toLowerCase().includes(newArr[0].toLowerCase()) || value.lname.toLowerCase().includes(newArr[1].toLowerCase()) //checks if elements match fname and lname
            } else {
                return value.fname.toLowerCase().includes(searchInput.toLowerCase()) || value.lname.toLowerCase().includes(searchInput.toLowerCase())
            }
        });
        if (searchInput === ""){ //if empty, remove the search result box
            setMatchedData([]);
        } else{
            setMatchedData(newMatch);
        }     
    }

    return(
        <div className="search">
            <div className="searchInput">
                <input type="text" placeholder="Search Bedev" onChange={handleMatch}/>
                <div className="searchIcon"><i className="fa-solid fa-magnifying-glass"></i> </div>
            </div>
            {matchedData.length !== 0 && (<div className="searchResults">
                {matchedData.slice(0,10).map((user, key) => {
                    return <Link className="dataItem" to={"/user/" + user._id}>{user.fname} {user.lname}</Link>
                })}
            </div>)}
        </div>
    )
}

export default Searchbar