import React from 'react'
import "./featured.scss"

const Featured = () => {
  return (
    <div className='featured'>

        <div className="top">
            <h1 className="title">Total Revenue</h1>
        </div>
        <div className="bottom">
            <p className="title">Total Sales Made Today</p>
            <p className="amount">428$</p>
        </div>
    </div>
  )
}

export default Featured