import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Authentication/Register/Register";
import Login from "./Authentication/Login/Login";
import Home from "./Page/Home/Home";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Profile from "./Page/Profile/Profile";
import { AuthProvider } from "./contextApi/AuthContext";
import EditProfile from "./Page/EditProfile/EditProfile";
import Header from "./Components/Header/Header";
import CreatePost from "./Page/Post/Post";
import Inbox from "./Page/Inbox/Inbox";



function App() {





  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route index path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/createpost" element={<ProtectedRoute element={<CreatePost />} />} />
          <Route path="/profile/:id" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/editprofile/:id" element={<ProtectedRoute element={<EditProfile />} />} />
          <Route path="/inbox/:id" element={<ProtectedRoute element={<Inbox />} />} />

          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
