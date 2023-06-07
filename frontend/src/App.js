import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import UserProfile from "./pages/User"


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact={true} path="/" element={<Signup />} />
          <Route exact={true} path="/login" element={<Login />} />
          <Route exact={true} path="/feed" element={<Feed />} />
          <Route exact={true} path="/user/:id" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
