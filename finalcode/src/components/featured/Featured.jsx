import React from 'react'
import "./featured.scss"

const Featured = ({allorders,activewarehouses,activeinventory,}) => {
  return (
    <div className='featured'>

        <div className="top">
            <h1 style={{marginLeft:'15px',marginTop:"8px"}}className="title">General Summary</h1>
        </div>
        <div >
            <p style={{marginLeft:'15px',marginTop:"20px",color:"gray"}} >Active Inventory</p>
            <p style={{marginLeft:'15px',marginTop:"8px",fontWeight:"600",fontSize:"20px"}} >{activeinventory}</p>
            <p style={{marginLeft:'15px',marginTop:"8px",color:"gray"}} >Active Warehouses</p>
            <p style={{marginLeft:'15px',marginTop:"8px",fontWeight:"600",fontSize:"20px"}} >{activewarehouses}</p>
            <p style={{marginLeft:'15px',marginTop:"8px",color:"gray"}} >Total Orders</p>
            <p style={{marginLeft:'15px',marginTop:"8px",fontWeight:"600",fontSize:"20px"}} >{allorders}</p>

        </div>
    </div>
  )
}

export default Featured