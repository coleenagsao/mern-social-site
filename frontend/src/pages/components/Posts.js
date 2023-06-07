import React from 'react';
import Post from './Post.js'

class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [], //stores all post of user and their friends
        }

        this.Posts = this.Posts.bind(this);
    }

    componentDidMount() { //sends a GET request to get all posts to all their connected users
        fetch("http://localhost:3001/readTimeline/" + this.props.userId)
            .then(response => response.json())
            .then(data => {
                this.setState({ posts: data });
            })
            .catch(function(err) {
                console.log(err);
                console.log("POSTS: Error retrieving data");
            })
    }

    Posts(){ //iterates through all the post and returns a Post Component
        return this.state.posts.map(function(post,index){
            return <div className="Post" key ={index}><Post data = {post} key = {index}/></div>
        });
    }

    render(){
        return(
            <div className="PostsContainer">
                {this.Posts()}
            </div>
        )
    }
}

export default Posts;