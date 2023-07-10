import React from 'react';
import "./ecommerce.scss";

import {PurchaseDateGraph, Widget,OrdergraphAdmin} from '../../componentsadmin';
import {ProductCategoryGraph} from '../../componentsadmin'
import { FeaturedAdmin } from '../../componentsadmin';

const Ecommerce = ({allorders,orders,allproducts,products,totalsellers,totalwarehouses,unansweredseller,unansweredwarehouse}) => {
  console.log(orders);

  return (
    <div className='home'>
        
        <div className='widgets'>
            <Widget type="Sellers" value={totalsellers}/>
            <Widget type="Warehouses" value={totalwarehouses}  />
            <Widget type="SellersDispute" value={unansweredseller}/>
            <Widget type="WarehousesDispute" value={unansweredwarehouse}/>
            

        </div>

<div className="charts" style={{marginTop:"30px"}}>


         
<FeaturedAdmin allorders={allorders} activeinventory={allproducts}/>
<PurchaseDateGraph purchases={orders}/>

</div>




        
        <div className="charts" style={{marginTop:"40px"}}>


         
          <OrdergraphAdmin orders={orders}/>
          <ProductCategoryGraph products={products}/>

        </div>

        <div style={{marginTop:"100px"}}></div>
        

    </div>
  )
}

export default Ecommerce