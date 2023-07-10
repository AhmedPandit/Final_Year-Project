import React,{useEffect,useState} from 'react';
import {useDispatch} from 'react-redux';
import { getchatuser } from '../../actions/chat';


const Chat = ({value,user,selected}) => {

    const dispatch=useDispatch();

    const [warehouses,setWarehouses]=useState([])


    const getchat= async()=>{

        if(value=="Warehouses"){
            const data = await dispatch(getchatuser(user));
            setWarehouses(data);

        }
        else if (value =="Buyers"){

        }
        else{

        }


    }


    useEffect(() => {
        setTimeout(getchat, 1000)
    }, [value,user,selected]);

    return(
        <div>
            
        </div>
    )

}

export default Chat;