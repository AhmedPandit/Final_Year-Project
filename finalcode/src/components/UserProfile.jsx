import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import {Button ,CardMedia} from '@material-ui/core';
import { userProfileData,userProfileData2 }  from '../data/dummy';
import { useStateContext } from "../context/ContextProvider";
import { useDispatch } from 'react-redux';

const UserProfile = ({name,email,pic}) => {
  const { currentColor,handleCloseClick } = useStateContext();
  const authdata = JSON.parse(localStorage.getItem('profile'));
  const dispatch=useDispatch();



  const logout = () => {

    dispatch({ type:'LOGOUTSELLER' });
  
    window.location.href='/auth'
  
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
      <CardMedia className="rounded-full h-24 w-24" image={pic} />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> {name}</p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {email} </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (

          <div key={index} onClick={()=>{window.location.href=`/${item.desc}/${email}`}} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
            </div>
          </div>
        ))}
         {userProfileData2.map((item, index) => (

          <div key={index}onClick={() => {
            window.open(
              `http://localhost:3006/login/${authdata.email}`,
              "_blank",
              "noreferrer"
            );
          }} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
          <Button style={{width:'100%'}} variant="contained"  color="secondary" onClick={logout}>Logout</Button>
      </div>
    </div>

  );
};

export default UserProfile;