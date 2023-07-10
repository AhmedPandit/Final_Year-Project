import React from 'react';
import "./widget.scss";
import {MdOutlineKeyboardArrowUp} from "react-icons/md";
const Widget = ({type,value}) => {
    let data;
    console.log(value+"in Widget")

    switch(type){
        case "Order":
            data={
              title:"Orders",
              counter:value,
             
            };
            break;
        case "Earning":
              data={
                title:"Earned Revenue",
                counter:value,
               
              };
              break;
        case "Balance":
                data={
                  title:"Balance",
                  counter:value,
                
                };
                break;
        case "AccountHealth":
            data={
              title:"Account Status",
              counter:value,
           
            };
            break;
          case "Area":
              data={
                title:"Area",
                counter:value,
             
              };
              break;
        default:
          break;
    }

  return (

    <div className='widget'>

        <div className='left'>
                <span className="title">{data.title}</span>
                <span className="counter">{data.counter}</span>
                
        </div>
     
    </div>
  )
}

export default Widget;