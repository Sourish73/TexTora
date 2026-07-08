import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { createGroupChat } from '../../../apiCalls/chat';
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import { setAllChats, setSelectedChat } from '../../../redux/userSlice';
import { FaTimes } from 'react-icons/fa';

function CreateGroupModal({ isOpen, onClose, allUsers, currentUser, allChats }) {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleUserSelect = (user) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    if (selectedUsers.length < 2) {
      toast.error('Please select at least 2 other users');
      return;
    }

    try {
      dispatch(showLoader());
      const payload = {
        isGroupChat: true,
        chatName: groupName,
        members: [currentUser._id, ...selectedUsers.map((u) => u._id)],
        admin: currentUser._id,
      };

      const response = await createGroupChat(payload);
      dispatch(hideLoader());

      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
        dispatch(setAllChats([...allChats, newChat]));
        dispatch(setSelectedChat(newChat));
        onClose();
        setGroupName('');
        setSelectedUsers([]);
      } else {
        toast.error(response.message || 'Failed to create group');
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message || 'Failed to create group');
    }
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      user._id !== currentUser._id &&
      (user.firstname?.toLowerCase().includes(searchKey.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(searchKey.toLowerCase()))
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content group-modal">
        <div className="modal-header">
          <h2>Create Group Chat</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <input
            type="text"
            className="group-name-input"
            placeholder="Enter Group Name..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <input
            type="text"
            className="group-search-input"
            placeholder="Search users to add..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />

          <div className="selected-users-badges">
            {selectedUsers.map((user) => (
              <span key={user._id} className="user-badge" onClick={() => handleUserSelect(user)}>
                {user.firstname} &times;
              </span>
            ))}
          </div>

          <div className="users-list-container">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`user-list-item ${selectedUsers.some((u) => u._id === user._id) ? 'selected' : ''}`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="user-avatar-small">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="profile" />
                  ) : (
                    `${user.firstname?.charAt(0)}${user.lastname?.charAt(0)}`
                  )}
                </div>
                <div className="user-name-small">
                  {user.firstname} {user.lastname}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-create" onClick={handleCreateGroup}>Create</button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupModal;
