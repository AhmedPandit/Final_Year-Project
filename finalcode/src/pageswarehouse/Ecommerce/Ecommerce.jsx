import React from 'react';
import "./ecommerce.scss";


import { LatestOrder,Widget} from '../../components';


const Ecommerce = ({pendingorders,balance,accounthealth,earnings,latestorders,status,warehousearea}) => {
  console.log(accounthealth +"ecommerce")
  return (
    <div className='home'>
        
        <div className='widgets'>
            <Widget type="Order" value={pendingorders}/>
            <Widget type="Earning" value={earnings}  />
            <Widget type="Balance" value={balance}/>
            <Widget type="AccountHealth" value={accounthealth}/>
            <Widget type="Area" value={warehousearea}/>
            

        </div>

        {status=="activated" ? <div className='listContainer'>
          <div className='listTitle'> Latest Orders
              <LatestOrder latestorders={latestorders}/>
          </div>
          </div>:(<div >
                <p style={{fontWeight:"bold",fontSize:"30px",color:"red",marginTop:"180px",marginLeft:"400px"}}>Warehouse Status is Inactive</p>
                <p style={{fontWeight:"bold",fontSize:"15px",color:"gray",marginTop:"10px",marginLeft:"440px"}}>Go to Settings and Fill in the remaining details</p>
            </div>) } 

        </div>
 
  )
}

export default Ecommerce