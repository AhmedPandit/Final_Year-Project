import React from 'react';
import "./ecommerce.scss";

import {Widget,Ordergraph} from '../../components';
import Featured from '../../components/featured/Featured';

import Chart from '../../componentswarehouse/Chart/Chart';

const Ecommerce = ({pendingorders,balance,accounthealth,earnings,activewarehouses,activeinventory,allorders,orders}) => {
  console.log(accounthealth +"ecommerce")
  console.log(allorders)
  return (
    <div className='home'>
        
        <div className='widgets'>
            <Widget type="Order" value={pendingorders}/>
            <Widget type="Earning" value={earnings}  />
            <Widget type="Balance" value={balance}/>
            <Widget type="AccountHealth" value={accounthealth}/>
            

        </div>
        
        <div className="charts" style={{marginTop:"30px"}}>

          <Featured allorders={allorders} activewarehouses={activewarehouses} activeinventory={activeinventory}/>
          <Ordergraph orders={orders} />

        </div>
        

    </div>
  )
}

export default Ecommerce