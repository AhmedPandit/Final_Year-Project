import React,{useEffect, useState} from 'react';
import {AiOutlineMenu} from "react-icons/ai";
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import {BsChatLeft} from "react-icons/bs"; 
import {RiNotification3Line} from "react-icons/ri";
import {MdOutlineKeyboardArrowDown} from "react-icons/md";
import {TooltipComponent} from "@syncfusion/ej2-react-popups";
import avatar from "../data/avatar.jpg";
import {UserProfile} from ".";
import { useStateContext } from '../context/ContextProvider';
import { useDispatch } from 'react-redux';





const NavButton=({title,icon,color,dotColor,customFunc})=>(
  <TooltipComponent content={title} position="BottomCenter">
      <button type="button" onClick={customFunc} style={{color}} className="relative text-xl rounded-full p-3
       hover:bg-light-gray">
          <span style={{background:dotColor}} className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
              {icon}
      </button>
  </TooltipComponent>
)




const Navbar = ({username,email,selectedfile}) => {

  const dispatch = useDispatch();


      const {activeMenu,setactiveMenu,isclicked,setisclicked,handleClick,
        screensize,setscreensize}=useStateContext();

        useEffect(()=>{ 
      const handleResize=()=>setscreensize(window.innerWidth);
      window.addEventListener('resize',handleResize);

      handleResize();

      return ()=>window.removeEventListener('resize',handleResize);

    },[])

    useEffect(()=>{
      if(screensize<=900){
        setactiveMenu(false);

      }
      else{
        setactiveMenu(true);
      }
    },[screensize])
  return (
    <div  className='flex justify-between p-2  relative'>

      <NavButton title="Menu" customFunc={()=>setactiveMenu((prevactiveMenu)=>!prevactiveMenu)} color="#961818" icon={<AiOutlineMenu/>}/>

      <div className='flex'>
              
              
               <TooltipComponent content="userProfile" position="BottomCenter">
                    <div className='flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg' 
                    onClick={()=>handleClick("userProfile")}>
                      <p>
                        <span style={{fontSize:'15px'}} className='text-gray-400 text-14'>Hi,</span>{' '}
                        <span style={{fontSize:'15px'}} className='text-gray-600 font-bold ml-1 text-14'>{username}</span>
                      </p>
                      <MdOutlineKeyboardArrowDown size={25} className='text-gray-400 text-14'/>

                    </div>
               </TooltipComponent>

    
               {isclicked.userProfile && <UserProfile name={username} email={email} pic={selectedfile}/>}




      </div>
    </div>
  )
}

export default Navbar