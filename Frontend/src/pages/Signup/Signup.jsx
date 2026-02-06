import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlinePicture } from 'react-icons/ai';
import {toast} from "react-hot-toast"
import './Signup.css';
import { signupUser } from '../../apiCalls/auth';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/loaderSlice';

export  default function Signup  ()  {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePic: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    dispatch(showLoader());

    const response = await signupUser({
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
      profilePic: formData.profilePic,
    });

    dispatch(hideLoader());

    if (response?.success) {
      toast.success(response.message);
      navigate("/login");
    } else {
      toast.error(response.message);
    }

  } catch (error) {
    dispatch(hideLoader());
    toast.error("Registration failed");
  }
};

  return (
    
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join Quick-Chat and start chatting instantly</p>
          </div>

          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <AiOutlineUser className="input-icon" />
                  <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                    className={errors.firstname ? 'input-error' : ''}
                    required
                  />
                </div>
                {errors.firstname && <span className="error-text">{errors.firstname}</span>}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <AiOutlineUser className="input-icon" />
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                    className={errors.lastname ? 'input-error' : ''}
                    required
                  />
                </div>
                {errors.lastname && <span className="error-text">{errors.lastname}</span>}
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <AiOutlineMail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                  required
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <AiOutlineLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min. 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                  required
                  minLength="8"
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <AiOutlineLock className="input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'input-error' : ''}
                  required
                />
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <AiOutlinePicture className="input-icon" />
                <input
                  type="text"
                  name="profilePic"
                  placeholder="Profile Picture URL (Optional)"
                  value={formData.profilePic}
                  onChange={handleChange}
                />
              </div>
              <small className="helper-text">Add a profile picture URL (optional)</small>
            </div>

            <button 
              type="submit" 
              className="signup-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

        
       

          <div className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>

  );
}

