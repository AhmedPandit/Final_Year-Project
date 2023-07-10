import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { AppBar, Typography, Toolbar, Avatar, Button ,CardMedia} from '@material-ui/core';

import { userProfileData,userProfileData2 }  from '../data/dummy';
import { useStateContext } from "../context/ContextProvider";
import avatar from '../data/avatar.jpg';
import { useDispatch } from 'react-redux';

const UserProfile = ({name,email,pic}) => {
  const { currentColor,handleCloseClick } = useStateContext();
  const authdata = JSON.parse(localStorage.getItem('adminprofile'));
  const dispatch=useDispatch();



  const logout = () => {

    dispatch({ type:'LOGOUTADMIN' });
  
    window.location.href='/auth/admin'
  
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <button
            type="button"
            onClick={() => handleCloseClick("chat")}
            style={{  color:"rgb(153, 171, 180)", borderRadius:"50%" }}
  
          >
            {<MdOutlineCancel size={25}/>}
      </button>
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> {name}</p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {email} </p>
        </div>
      </div>
      <div>
      
      </div>
      <div className="mt-5">
          <Button style={{width:'100%'}} variant="contained"  color="secondary" onClick={logout}>Logout</Button>
      </div>
    </div>

  );
};

export default UserProfile;