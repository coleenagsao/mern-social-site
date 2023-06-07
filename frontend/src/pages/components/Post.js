import React from 'react'
import profile from "../img/profile.png";
import moment from 'moment';  //for date parsing and formatting

import { Modal } from 'react-responsive-modal'; //for the pop up for edit post
import 'react-responsive-modal/styles.css';
import "./Post.css"

class Post extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            id: this.props.data.author,
            postId: this.props.data._id,
            fname: "", 
            lname: "",
            content: "",
            openModal: false,
            adminId: localStorage.getItem("id")
        }
        
        this.onClickButton = this.onClickButton.bind(this)
        this.onCloseModal = this.onCloseModal.bind(this)

        this.onChangeContent = this.onChangeContent.bind(this)
        this.updatePost = this.updatePost.bind(this)

        this.deletePost = this.deletePost.bind(this)
    }

    componentDidMount() {
        //once mounted, gets the information of the post author
        const link = "http://localhost:3001/findById/" + this.state.id
        fetch(link)
            .then(response => response.json())
            .then(data => {
                this.setState({ fname: data.fname, lname: data.lname });
            })
            .catch(function(err) {
                console.log(err);
                alert("POST: Error retrieving data");
            })

        //fetch the specific post info and store the fetched content to this.state.content
        const link1 = "http://localhost:3001/findPostbyId/" + this.state.postId
        fetch(link1)
            .then(response => response.json())
            .then(data => {
                this.setState({ content: data.content})
            })
            .catch(function(err){
                console.log(err)
            })
    }

    onClickButton(e){  //opens the modal
        e.preventDefault()
        this.setState({openModal : true})
    }

    onCloseModal(){  //closes the modal
        this.setState({openModal : false})
    }

    onChangeContent(e){ //stores the e.target value to content during the update post
        this.setState({content: e.target.value})
    }

    updatePost(e){ //sends a POST request to edit user post with updated content as its body
        e.preventDefault();
        const updatePost = {
            content: this.state.content
        }

        const link2 = "http://localhost:3001/updatePost/" + this.state.postId
        fetch(link2, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify(updatePost)
        })
        .then(response => response.json())
        .then(body => {
            if (body.success) { 
              console.log("EDIT: Successfully edited post"); 
              window.location = window.location
            }
            else { 
              console.log("EDIT: Failed to save edit post"); 
            }
          });
    }

    deletePost(){ //sends a POST request to delete the user post chosen
        const link3 = "http://localhost:3001/deletePost/" + this.state.postId
        fetch(link3, {
            method: 'POST'
        })
        .catch(function(err){
            console.log(err)
        })
        
        window.location = window.location;
    }

    render(){
        const post = this.props.data;
        var formattedDate = moment(post.timestamp).format(`MMMM DD, hh:mm a`);
        if (post.author == this.state.adminId){ //if post is from user, buttons for edit and delete is included
            return (
                <div className="post">
                    <div className="postContainer">
                        <div className="postTop">
                            <div className="postTopLeft">
                                <div>
                                    <img className="AuthorImg"src={profile} alt=""/>
                                </div>
                                <div>
                                    <h3 className="postAuthor">{this.state.fname} {this.state.lname}</h3>
                                    <h5 className="postTimeStamp"> {formattedDate} · <i class="fa-solid fa-earth-americas"></i></h5>
                                </div> 
                            </div>
                            <div className="postTopRight">
                                <div className="postIcon"><i class="fa-solid fa-pen" onClick={this.onClickButton}></i></div>
                                <div className="postIcon"><i class="fa-solid fa-trash" onClick = {this.deletePost}></i></div>
                            </div> 
                        </div>
                        <h5 className="postContent">{post.content}</h5>
                        <div className="postBottom">
                        </div>
    
                        <Modal open={this.state.openModal} onClose={this.onCloseModal}>
                            <div>
                            <h1>Edit Post</h1>
                            <hr></hr>
                            <form onSubmit={this.updatePost}>
                                <input type="text" id="newContent" className="newContent" 
                                value={this.state.content}
                                onChange={this.onChangeContent}></input>
                                <button type="submit">Save</button>
                            </form>
                            </div>
                        </Modal>   
                    </div>
                </div>
            )
        } else {
            return (
                <div className="post">
                    <div className="postContainer">
                        <div className="postTop">
                            <div className="postTopLeft">
                                <div>
                                    <img className="AuthorImg"src={profile} alt=""/>
                                </div>
                                <div>
                                    <h3 className="postAuthor">{this.state.fname} {this.state.lname}</h3>
                                    <h5 className="postTimeStamp"> {formattedDate} · <i class="fa-solid fa-earth-americas"></i></h5>
                                </div> 
                            </div>
                            <div className="postTopRight">
                            </div> 
                        </div>
                        <h5 className="postContent">{post.content}</h5>
                        <div className="postBottom">
                        </div>
                    </div>
                </div>
            )
        }
        
    }
}

export default Post;