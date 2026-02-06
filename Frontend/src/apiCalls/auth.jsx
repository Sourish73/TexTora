import { axiosInstance } from "./index";

export const signupUser = async (user) => {
  try {
    const response = await axiosInstance.post('/api/auth/signup', user);
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};


export const loginUser = async (user) => {
  try {
    const response = await axiosInstance.post(
      "/api/auth/login",
      user   // 👈 this sends email & password
    );
    return response.data; // 👈 ONLY data
  } catch (error) {
    return error.response?.data;
  }
};
