import { signUp, login, checkIfLoggedIn, createPost, findById, findPostbyId, updatePost, deletePost, addFriend, readTimeline, displayNotFriends, addFriendRequest, displayFriendRequests, displayFriends, deleteFriendRequest, findAllUsers} from "./auth-controller.js";

const setUpRoutes = (app) => {
  app.post("/signup", signUp);                                    //sign up and login
  app.post("/login", login);
  app.post("/checkifloggedin", checkIfLoggedIn);

  app.post("/createPost", createPost);                            //CRUD
  app.get("/readTimeline/:id", readTimeline);                     //displays user and their friends post
  app.post("/updatePost/:id", updatePost);
  app.post("/deletePost/:id", deletePost);

  app.get("/displayFriends/:id", displayFriends)                  //displays current users friends for rightbar
  app.get("/displayNotFriends/:id", displayNotFriends);           //display people you may know for rightbar
  app.get("/displayFriendRequests/:id", displayFriendRequests)    //displays pending requests for sidebar

  app.get("/findById/:id", findById);                             //get user info based on user id
  app.get("/findPostbyId/:id", findPostbyId)                      //get post info based on post id
  app.get("/allUsers", findAllUsers)                              //displays all users in the database

  app.post("/addFriend/:id", addFriend)                           //confirm friend request
  app.post("/addFriendRequest/:id", addFriendRequest)             //send a friend request
  app.post("/deleteFriendRequest/:id", deleteFriendRequest)       //delete a friend request
}
 
export default setUpRoutes;