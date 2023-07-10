import React from 'react';
import "./widget.scss";
import {MdOutlineKeyboardArrowUp} from "react-icons/md";
const Widget = ({type,value}) => {
    let data;
    console.log(value)

    switch(type){
        case "Sellers":
            data={
              title:"Total Sellers",
              counter:value,
            
            };
            break;
        case "Warehouses":
              data={
                title:"Total Warehouses",
                counter:value,
              
              };
              break;
        case "SellersDispute":
                data={
                  title:"Seller Dispute",
                  counter:value,
                 
                };
                break;
        case "WarehousesDispute":
            data={
              title:"Warehouse Dispute",
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
                <span className="link">{data.link}</span>
        </div>
     
    </div>
  )
}

export default Widget;