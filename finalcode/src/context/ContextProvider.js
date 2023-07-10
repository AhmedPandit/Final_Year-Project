import React, {createContext,useContext,useState} from "react";

const StateContext=createContext();

const initialState={
    chat:false,
    cart:false,
    userProfile:false,
    notification:false,
}

export const ContextProvider=({children})=>{
    const [activeMenu, setactiveMenu] = useState(true);
    const [isclicked, setisclicked] = useState(initialState);
    const [screensize, setscreensize] = useState(undefined);
    

    const handleClick=(clicked)=>{
        setisclicked({...initialState,[clicked]:true})
    }

    const handleCloseClick=(clicked)=>{
        setisclicked({...initialState,[clicked]:false})
    }
    return(
        <StateContext.Provider value={{activeMenu,setactiveMenu,initialState,isclicked,setisclicked,handleClick,handleCloseClick
        ,screensize,setscreensize}}>
            {children}
        </StateContext.Provider>
    )

}

export const useStateContext=()=>useContext(StateContext);  


