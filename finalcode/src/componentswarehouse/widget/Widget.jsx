import React from 'react';
import "./widget.scss";
import {MdOutlineKeyboardArrowUp} from "react-icons/md";
const Widget = ({type,value}) => {
    let data;

    switch(type){
        case "Order":
            data={
              title:"Orders",
              counter:value,
              link:"View all Orders"
            };
            break;
        case "Earning":
              data={
                title:"Earnings",
                counter:value,
                link:"View all Earnings"
              };
              break;
        case "Balance":
                data={
                  title:"Balance",
                  counter:value,
                  link:"View Balance"
                };
                break;
        case "AccountHealth":
            data={
              title:"Account Health",
              counter:value,
              link:"View Account Health"
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
                <span className="link">{data.link}</span>
        </div>
     
    </div>
  )
}

export default Widget;