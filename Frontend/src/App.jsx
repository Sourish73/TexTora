import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import "./index.css";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/loader";
import { useSelector } from "react-redux";
import Profile from "./pages/profile/profile";

function App() {
  const loading = useSelector(state => state.loader);

  return (
    <>
    <Toaster position="top-center" reverseOrder={false}/>

    {loading &&<Loader />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute> <Home /></ProtectedRoute>} />

            <Route path="/profile" element={<ProtectedRoute> <Profile /></ProtectedRoute>} />


          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;