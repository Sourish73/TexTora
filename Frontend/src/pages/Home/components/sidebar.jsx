import React from 'react'
import Search from './search'
import UserList from './userList';
import CreateGroupModal from './CreateGroupModal';
import { useState } from "react";
import { useSelector } from 'react-redux';
import { FaPlus } from 'react-icons/fa';

function Sidebar({socket,onlineUser}) {
    const [searchKey, setSearchKey] = useState('');
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    
    // Get users and chats from redux store
    const { allUsers, user, allChats } = useSelector(state => state.user);

  return (
    <div className='app-sidebar'>
      <div className='sidebar-header-actions' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Chats</h2>
        <button 
          onClick={() => setIsGroupModalOpen(true)}
          title="Create Group Chat"
          style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            border: 'none', 
            borderRadius: '50%', 
            width: '35px', 
            height: '35px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            color: 'inherit'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <FaPlus />
        </button>
      </div>
      
      <Search searchKey={searchKey} setSearchKey={setSearchKey} />
      
      <UserList
        searchKey={searchKey}
        socket={socket}
        onlineUser={onlineUser}
      />
      
      {user && (
        <CreateGroupModal 
          isOpen={isGroupModalOpen} 
          onClose={() => setIsGroupModalOpen(false)} 
          allUsers={allUsers || []} 
          currentUser={user} 
          allChats={allChats || []} 
        />
      )}
    </div>
  )
}

export default Sidebar