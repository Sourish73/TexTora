import React from 'react'
import Search from './search'
import UserList from './userList';
import { useState } from "react";


function Sidebar({socket,onlineUser}) {
    const [searchKey, setSearchKey] = useState(' ');
  return (
    <div className='app-sidebar'>sidebar
    <Search searchKey = {searchKey} setSearchKey = {setSearchKey}> </Search>
    <UserList
     searchKey = {searchKey}
      socket = {socket}
          onlineUser = {onlineUser}
        >
      </UserList>
    </div>
    
  )
}

export default Sidebar