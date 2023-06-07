import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const User = mongoose.model("User");  // get user model registered in Mongoose
const Post = mongoose.model("Post");  //get post model registered in Mongoose

const createPost = (req, res) => {    //function that saves new post in the database
  const newPost = new Post({
    author: req.body.author,
    content: req.body.content
  });

  console.log("New post: ");
  console.log(newPost);
  
  newPost.save((err) => {
    if (err) { return res.send({ success: false }); }
    else { return res.send({ success: true }); }
  });
}

const readTimeline = async(req, res) => { //get own and friends posts //not sorted yet
  try{
    const currentUser = await User.findById(req.params.id);   //gets current user based on the id
    const connection = currentUser.friends;                   //adds friends id to connection
    connection.push(currentUser._id);                         //adds user id to connection 

    const timelinePosts = await Post.find({author: {$in: connection}}).sort({timestamp: -1}); //finds post of user and friends
    res.json(timelinePosts);

  } catch(err){
    res.status(500).json(err)
  }
}

const findById = (req, res) => {  //get user info based on user id
  let id = req.params.id
  User.findOne({_id: id}, function(err, user){
    res.json(user)
  })
}

const findPostbyId = (req, res) => { //get post info based on post id
  let id = req.params.id
  Post.findOne({_id: id}, function(err, post){
    res.json(post)
  })
}

const findAllUsers = (req, res) => { //get json file for all users for the search feature
  User.find(function (err, user){
    res.json(user)
  })
}

const updatePost = (req, res) => {  //updates the post content to the content body from request
  Post.findById(req.params.id, function(err, post){
    if (!post){
      alert('Data not found')
    } else {
        post.content = req.body.content;

        console.log(post.content)
        post.save((err) => {
          if (err) { return res.send({ success: false }); }
          else { return res.send({ success: true }); }
        });
    }
  })
}

const deletePost = (req, res) => { //delete post chosen
  Post.findByIdAndDelete(req.params.id)
    .then(post => {
      if(!post){
        alert('DELETING ERROR: Post to delete not found')
      }
      res.send({message: "Post deleted successfully"})
    })
    .catch(err => {
      console.log(err)
    })
}

const addFriend = async(req, res) => {  //confirm friend request
  if (req.body.id != req.params.id){
    try{
      const currentUser = await User.findById(req.body.id);         //get user info of the logged in user
      const potentialFriend = await User.findById(req.params.id);   //get user info of friend request sender
      
      if (!potentialFriend.friends.includes(req.body.id)){          //checks if their friends array already contain current user
          await potentialFriend.updateOne({$push: {friends: req.body.id}}); //adds current user id to new friend's friends
          await currentUser.updateOne({$push: {friends: req.params.id}});   //adds new friend to current user's friends
          
          //removes the user id in friend request and sent friend request of current user and sender respectively
          await currentUser.updateOne({$pull: {friendRequests: req.params.id}});
          await potentialFriend.updateOne({$pull: {sentFriendRequests: req.body.id}});

          console.log("User is sucessfully added as your friend.")
          return res.send({ success: true });
      } else{
        console.log("User is already your friend.")   
        return res.send({ success: false });
      }
    } catch(err) {
        console.log(err)
        return res.send({ success: false });
    }
  } else {
    res.status(403).json("You cannot be friends with yourself.")
    return res.send({ success: false });
  }
}

const deleteFriendRequest = async(req, res) => { //deletes the pending request
  if (req.body.id != req.params.id){
    try{
      const currentUser = await User.findById(req.body.id);
      const potentialFriend = await User.findById(req.params.id);
      
      if (currentUser.friendRequests.includes(req.params.id)){                          //if found, removes the requests
          await currentUser.updateOne({$pull: {friendRequests: req.params.id}});
          await potentialFriend.updateOne({$pull: {sentFriendRequests: req.body.id}});
          console.log("The friend request is sucessfully deleted.")
          return res.send({ success: true });
      } else{
        console.log("There is no friend request existing anymore.")
        return res.send({ success: false });
      }
    } catch(err) {
        console.log(err)
        return res.send({ success: false });
    }
  } else {
    return res.send({ success: false });
  }
}

const addFriendRequest = async(req, res) => { //sends a friend request
  console.log("Current User: " + req.body.id);
  console.log("Friend Request Receiver: " + req.params.id);

  if (req.body.id != req.params.id){
    try{
      const friendRequestUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.id);

      if (!friendRequestUser.friendRequests.includes(req.body.id)){
          await friendRequestUser.updateOne({$push: {friendRequests: req.body.id}}); //adds user id to friend request of receiver
          await currentUser.updateOne({$push: {sentFriendRequests: req.params.id}}); //adds receiver id to current users sent fr
          console.log("You sucessfully sent a friend request.")
          return res.send({ success: true });
      } else{
        console.log("You already sent a friend request.")
        return res.send({ success: false });
      }
    } catch(err) {
        console.log(err)
        return res.send({ success: false });
    }
  } else {
    res.status(403).json("You cannot be friends with yourself.")
    return res.send({ success: false });
  }
}

const displayNotFriends = async(req, res) => { //find users who are not yet connected to admin
  try{
    const currentUser = await User.findById(req.params.id);
    const userKnows = currentUser.friends;                    //adds friends id to userKnows array
    userKnows.push(currentUser._id);                          //adds admin id
    const finalConnection = userKnows.concat(currentUser.sentFriendRequests, currentUser.friendRequests) //adds sent request id and friend request id

    const notFriends = await User.find({_id: {$not: {$in: finalConnection}}}); //find users who are not included in array
    res.json(notFriends);

  } catch(err){
    res.status(500).json(err)
  }
}

const displayFriendRequests = async(req, res) => { //find users who sent friend request to admin
  try{
    const friendRequestReceiver = await User.findById(req.params.id);
    const friendRequests = await User.find({_id: {$in: friendRequestReceiver.friendRequests}});
    res.json(friendRequests);

  } catch(err){
    res.status(500).json(err)
  }
}

const displayFriends = async(req, res) => { //find users who sent friend request to admin
  try{
    const currentUser = await User.findById(req.params.id);
    const currentUserFriends = await User.find({_id: {$in: currentUser.friends}});
    res.json(currentUserFriends);

  } catch(err){
    res.status(500).json(err)
  }
}

const signUp = (req, res) => {
  const newuser = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password, 
  });

  console.log("New user: ");
  console.log(newuser);

  newuser.save((err) => {
    if (err) { return res.send({ success: false }); }
    else { return res.send({ success: true }); }
  });
}

const login = (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  User.findOne({ email }, (err, user) => {
    // check if email exists
    if (err || !user) {
      //  Scenario 1: FAIL - User doesn't exist
      console.log("user doesn't exist");
      return res.send({ success: false });
    }

    // check if password is correct
    user.comparePassword(password, (err, isMatch) => {
      if (err || !isMatch) {
        // Scenario 2: FAIL - Wrong password
        console.log("wrong password");
        return res.send({ success: false });
      }

      console.log("Successfully logged in");

      // Scenario 3: SUCCESS - time to create a token
      const tokenPayload = {
        _id: user._id
      }

      const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");

      // return the token to the client
      return res.send({ success: true, token, username: user.fname, id: user._id, lname: user.lname, email: user.email});

    })
  })
}

const checkIfLoggedIn = (req, res) => {
  if (!req.cookies || !req.cookies.authToken) {
    // Scenario 1: FAIL - No cookies / no authToken cookie sent
    return res.send({ isLoggedIn: false });
  }

  // Token is present. Validate it
  return jwt.verify(
    req.cookies.authToken,
    "THIS_IS_A_SECRET_STRING",
    (err, tokenPayload) => {
      if (err) {
        // Scenario 2: FAIL - Error validating token
        return res.send({ isLoggedIn: false });
      }

      const userId = tokenPayload._id;

      // check if user exists
      return User.findById(userId, (userErr, user) => {
        if (userErr || !user) {
          // Scenario 3: FAIL - Failed to find user based on id inside token payload
          return res.send({ isLoggedIn: false });
        }

        // Scenario 4: SUCCESS - token and user id are valid
        console.log("user is currently logged in");
        return res.send({ isLoggedIn: true });
      });
    });
}


export { signUp, login, checkIfLoggedIn, findById, findPostbyId, createPost, readTimeline, updatePost, deletePost, addFriend, displayNotFriends, addFriendRequest, displayFriendRequests, displayFriends, deleteFriendRequest, findAllUsers}