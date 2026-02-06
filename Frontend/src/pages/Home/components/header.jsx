import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaComments } from 'react-icons/fa';

function Header({ socket }) {
  const user = useSelector(state => state?.user?.user);
  const navigate = useNavigate();

  function getFullname() {
    const fname = user?.firstname?.toUpperCase() || '';
    const lname = user?.lastname?.toUpperCase() || '';
    return fname + ' ' + lname;
  }

  function getInitials() {
    const f = user?.firstname?.toUpperCase()[0] || '';
    const l = user?.lastname?.toUpperCase()[0] || '';
    return f + l;
  }

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    if (socket) {
      socket.emit('user-logout', user?._id);
    }
  }

  return (
    <div className="app-header">
      <div className="app-logo">
        <FaComments className="logo-icon" />
        <span className="logo-text">Quick Chat</span>
      </div>
      
      <div className="app-user-profile">
        {/* Profile Picture */}
        {user?.profilePic ? (
          <img 
            src={user.profilePic} 
            alt="profile" 
            className="logged-user-profile-pic" 
            onClick={() => navigate('/profile')}
          />
        ) : (
          <div 
            className="logged-user-profile-pic" 
            onClick={() => navigate('/profile')}
          >
            {getInitials()}
          </div>
        )}
        
        {/* User Name */}
        <div className="logged-user-name">
          {getFullname()}
        </div>
        
        {/* Logout Button - More visible version */}
        <button 
          className="logout-button"
          onClick={logout}
          title="Logout"
        >
          <FaSignOutAlt className="logout-icon" />
          <span className="logout-text">Logout</span>
        </button>
        
       
      </div>
    </div>
  )
}

export default Header;