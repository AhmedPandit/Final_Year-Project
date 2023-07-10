import React from 'react';
import {BrowserRouter,Route,Routes} from "react-router-dom";
import {  Homepage, ViewProduct, } from "./pages"; 
import {Orders,ConnectWarehouse,ViewWarehouses,EditInventory,ViewProducts,Addproduct,ViewOrder,AccountSettings,ForgotPassword,ConfirmPassword,ViewWarehouse,ViewFoundWarehouse,Chat,FileDispute,ViewDisputes,ViewDispute,RequestPayment} from "./pages/index"; 
import SignInoutContainer from './containers/index';
import { SignIn,HomePageAdmin,ViewSellersAdmin,ViewSellerAdmin,ViewWarehousesAdmin,ViewWarehouseAdmin,ViewDisputeWarehouseAdmin,ViewDisputeWareAdmin,ViewDisputeSellerAdmin,ViewDisputeSellAdmin,ViewBuyerQueries,ViewBuyerQuery} from './pagesadmin';
import ChatContainer from './containers/chat';
import "./App.css";
import { SupplierRequests, ViewSeller, ViewSellers, Warehousehomepage,ViewWarehouseProduct,Orderswarehouse,
AccountSettingswarehouse,ConfirmPasswordWarehouse,ViewOrderWarehouse,ViewInventoryWarehouse, FileDisputeWarehouse,ViewDisputesWarehouse,ViewDisputeWarehouse, RequestPaymentWarehouse} from './pageswarehouse/index';
import 'react-toastify/dist/ReactToastify.css';


const App = () => { 


   return (
    <div>
        <BrowserRouter>
   

               
                <div>
           
                    <Routes>

                     {/*auth*/}   
                     <Route path="/auth" element={<SignInoutContainer/>} />

                     <Route path="/Forgotpassword" element={<ForgotPassword/>} />
                     <Route path="/Resetpassword/:id/:token" element={<ConfirmPassword/>} />

                     
                     {/*Seller*/}

                        <Route path="/Home/:id" element={<Homepage/>}/>
                        <Route path="/FindWarehouses/:id" element={<ConnectWarehouse/>}/>
                        <Route path="/ViewWarehouses/:id" element={<ViewWarehouses/>}/>
                        <Route path="/ViewFoundWarehouse/:useremail/:warehouseemail" element={<ViewFoundWarehouse/>}/>
                        <Route path="/Account Settings/:id" element={<AccountSettings/>}/>
                        <Route path="/Chat/:user" element={<ChatContainer/>}/>
                      
                        {/* Add Product */}
                        <Route path="/AddProduct/:id" element={<Addproduct/>}/>

                        {/* View Product */}
                        <Route path="/ViewProduct/:id" element={<ViewProducts/>}/>

                        <Route path="/Inventory/ViewInventory/:userid/:productid" element={<ViewProduct/>}/>
                        <Route path="/Inventory/EditInventory/:userid/:productid" element={<EditInventory/>}/>

                        {/* Orders */}
                        <Route path="/Orders/:id" element={<Orders/>}/>
                        <Route path="/Orders/ViewOrder/:id/:orderid/:productid" element={<ViewOrder/>}/>

                        <Route path="/ViewWarehouse/:userid/:warehouseid" element={<ViewWarehouse/>}/>

                        <Route path="/FileDispute/seller/:id" element={<FileDispute/>}/>
                        <Route path="/ViewDisputes/seller/:id" element={<ViewDisputes/>}/>
                        <Route path="/ViewDispute/seller/:id" element={<ViewDispute/>}/>
                        <Route path="/RequestPayment/seller/:id" element={<RequestPayment/>}/>

                        {/* Warehouse */}

                        <Route path="/Home/warehouse/:id" element={<Warehousehomepage/>}/>
                        <Route path="/Orders/ViewOrder/warehouse/:id/:order" element={<ViewOrderWarehouse/>}/>
                        <Route path="/warehouse/Account Settings/:id" element={<AccountSettingswarehouse/>}/>
                        <Route path="/ViewWarehouseProducts/warehouse/:id" element={<ViewWarehouseProduct/>}/>
                        <Route path="/Resetpassword/warehouse/:id/:token" element={<ConfirmPasswordWarehouse/>} />
                        <Route path="/SellersRequest/warehouse/:id" element={<SupplierRequests/>}/>
                        <Route path="/ViewSellers/warehouse/:id" element={<ViewSellers/>}/>
                        <Route path="/ViewSeller/warehouse/:sellerid/:warehouseid" element={<ViewSeller/>}/>
                        <Route path="/Orders/warehouse/:id" element={<Orderswarehouse/>}/>
                        <Route path="/Inventory/ViewInventory/warehouse/:userid/:productid" element={<ViewInventoryWarehouse/>}/>
                        <Route path="/FileDisputeWarehouse/warehouse/:id" element={<FileDisputeWarehouse/>}/>
                        <Route path="/ViewDisputesWarehouse/warehouse/:id" element={<ViewDisputesWarehouse/>}/>
                        <Route path="/ViewDisputeWarehouse/warehouse/:id" element={<ViewDisputeWarehouse/>}/>
                        <Route path="/RequestPaymentWarehouse/warehouse/:id" element={<RequestPaymentWarehouse/>}/>


                          {/* Admin */}

                          <Route path="/auth/admin" element={<SignIn/>} />
                          <Route path="/Home/admin/:id" element={<HomePageAdmin/>} />
                          <Route path="/Sellers/admin/:id" element={<ViewSellersAdmin/>}/>
                          <Route path="/Warehouses/admin/:id" element={<ViewWarehousesAdmin/>}/>
                          <Route path="/ViewSeller/admin/:user/:id" element={<ViewSellerAdmin/>}/>
                          <Route path="/ViewWarehouse/admin/:user/:id" element={<ViewWarehouseAdmin/>}/>
                          <Route path="/DisputeWarehouse/admin/:id" element={<ViewDisputeWarehouseAdmin/>}/>
                          <Route path="/ViewDisputeWarehouse/admin/:id" element={<ViewDisputeWareAdmin/>}/>

                          <Route path="/DisputeSellers/admin/:id" element={<ViewDisputeSellerAdmin/>}/>
                          <Route path="/ViewDisputeSeller/admin/:id" element={<ViewDisputeSellAdmin/>}/>
                          <Route path="/ViewBuyerQueries/admin/:id" element={<ViewBuyerQueries/>}/>
                          <Route path="/ViewBuyerQuery/admin/:user/:id" element={<ViewBuyerQuery/>}/>
                     
                  


                    </Routes>

                

                </div>

            
        </BrowserRouter>

    </div>
  )
}

export default App