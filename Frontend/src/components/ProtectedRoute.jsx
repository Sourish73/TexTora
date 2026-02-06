import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { getLoggedUser, getAllUsers } from "../apiCalls/user";
import { getAllchats } from "../apiCalls/chat";

import { showLoader, hideLoader } from "../redux/loaderSlice";
import { setUser, setAllUsers, setAllChats } from "../redux/userSlice";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  // 1️⃣ Get logged-in user FIRST
  const getLoggedInUser = async () => {
    try {
      dispatch(showLoader());
      const response = await getLoggedUser();
      dispatch(hideLoader());

      if (response?.success) {
        dispatch(setUser(response.data));
      } else {
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoader());
      navigate("/login");
    }
  };

  // 2️⃣ Get all users AFTER user is set
  const getAllUser = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllUsers();
      dispatch(hideLoader());

      if (response?.success) {
        dispatch(setAllUsers(response.data));
      } else {
        toast.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoader());
      navigate("/login");
    }
  };

  // 3️⃣ Get chats AFTER user is set
  const getCurrentUserChats = async () => {
    try {
      const response = await getAllchats();
      if (response?.success) {
        dispatch(setAllChats(response.data));
      }
    } catch (error) {
      navigate("/login");
    }
  };

  // 🔐 FIRST EFFECT → check token & fetch logged user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    getLoggedInUser();
  }, []);

  // 🔁 SECOND EFFECT → once user exists, fetch others
  useEffect(() => {
    if (user) {
      getAllUser();
      getCurrentUserChats();
    }
  }, [user]);

  // ⛔ wait until user is loaded
  if (!user) return null;

  return <>{children}</>;
}

export default ProtectedRoute;
