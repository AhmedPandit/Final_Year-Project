import React from 'react'
import "./featured.scss"

const Featured = ({allorders,activeinventory,}) => {
  return (
    <div className='featured' style={{marginLeft:"50px",marginTop:"20px",marginBottom:"30px"}}>

        <div className="top">
            <h1 style={{marginLeft:'15px',marginTop:"8px"}}className="title">General Summary</h1>
        </div>
        <div >
            <p style={{marginLeft:'15px',marginTop:"20px",color:"gray"}} >Active Inventory</p>
            <p style={{marginLeft:'15px',marginTop:"8px",fontWeight:"600",fontSize:"20px"}} >{activeinventory}</p>
            <p style={{marginLeft:'15px',marginTop:"8px",color:"gray"}} >Total Orders</p>
            <p style={{marginLeft:'15px',marginTop:"8px",fontWeight:"600",fontSize:"20px"}} >{allorders}</p>

        </div>
    </div>
  )
}

export default Featured