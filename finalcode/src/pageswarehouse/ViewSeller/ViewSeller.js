import "./ViewSeller.css";
import React,{useEffect,useState} from 'react';
import {addsellertowarehouse} from "../../actions/warehouse";
import {useParams} from "react-router";
import {BrowserRouter,Route,Routes} from "react-router-dom";
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar,Footer, Header} from "../../componentswarehouse";
import { useStateContext } from '../../context/ContextProvider';
import {getwarehouseuser,getsellerinwarehouse,getsellerinwarehouserequest,removesellerfromwarehouse} from "../../actions/warehouse";
import {MDBTable,MDBTableHead,MDBTableBody,MDBTableRow,MDBCol,MDBContainer, MDBRow
    ,MDBBtn,MDBBtnGroup,MDBPagination,MDBPaginationItem,MDBPaginationLink} from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';

import { confirm } from "react-confirm-box";

const ViewSeller = () => { 
  const dispatch=useDispatch();

  const { sellerid,warehouseid } = useParams("");

  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [checkseller,setCheckSeller]=useState(1);
  const [userpic, setUserPic] = useState("");
  const [warehouseseller,setWarehouseSeller]=useState({});
  const [warehousesellerinventory,setWarehouseSellerInventory]=useState(0);
  const [warehousesellerorders,setWarehouseSellerOrders]=useState(0);

  // console.log([inddata]);

  const getiddata = async () => {

    const tosend={
        data:warehouseid
    }
    const authdata = JSON.parse(localStorage.getItem('wareprofile'));
    console.log('here')
    console.log(authdata);
    setUserName(authdata.name);
    setUserEmail(authdata.email);
    setUserPic(authdata.image)
    
    

  };



  const getsellerdata = async () => {

    console.log("here");

    const sellerdata=await dispatch(getsellerinwarehouse({sellerid,warehouseid}));
    console.log("here");
    console.log(sellerdata.data)

    if(sellerdata.data){
      console.log("here");

      console.log(sellerdata);
  
      setWarehouseSeller(sellerdata.data)
      setWarehouseSellerInventory(sellerdata.inventory)
      setWarehouseSellerOrders(sellerdata.orders)

      setCheckSeller(1)
     
    }
    else{
    
      
      const sellerrequestdata=await dispatch(getsellerinwarehouserequest({sellerid,warehouseid}));
      setWarehouseSeller(sellerrequestdata)
      
      console.log(sellerrequestdata);
      setCheckSeller(2)
    }



   

  };

  const handleRemove=async(options)=>{

    if(warehousesellerinventory==0 && warehousesellerorders==0){

    const result = await confirm("Are you sure You want to remove this seller? ", options);
    if (result) {
      console.log("You click yes!");
      
      await dispatch (removesellerfromwarehouse({sellerid,warehouseid}));
      console.log("seller removed")
      window.location.href=`/ViewSellers/warehouse/${useremail}`;
      return;
    }
    console.log("You click No!");  

    }
    else{
      toast.error('Sellers Inventory and Orders should be zero before removal', {
        position: toast.POSITION.TOP_RIGHT
    });

    }

      
  
  }

  const handleConnect= async (options)=>{

    const result = await confirm("Are you sure You want to add this seller? ", options);
    if (result) {
      console.log("You click yes!");
      console.log("here")
      const selleremail=warehouseseller.email;
      const data=await dispatch(addsellertowarehouse({selleremail,useremail}));
      console.log("here")
      window.location.href=`/ViewSellers/warehouse/${useremail}`; 
      return;
    }
    console.log("You click No!");  
   
   
   
     
  } 


  useEffect(() => {
      setTimeout(getiddata, 1000)
      setTimeout(getsellerdata,1000)
  }, [warehouseid]);


const {activeMenu}=useStateContext();
 return (
  <div>
          <div className='flex relative dark:bg-main-dark-bg'>
                 
              {activeMenu ? (
                  <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
                    <  Sidebar email={useremail} />
                  </div>
              ):(<div className='w-0 dark:bg-secondary-dark-bg'>
                     <Sidebar/>
                  </div>
              )}
              <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu? 'md:ml-72' :'flex-2'}`}>
                  <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                      <Navbar username={username} email={useremail} selectedfile={userpic}/>
                  </div>
                 
                  <div style={{marginLeft:'10px',marginTop:'20px'}}>
                    

<div className="upperdiv">

    <Header title="Seller Details"/>


</div>

{checkseller==1? (
    <button style={{marginLeft:"90%", backgroundColor:'darkred', color:'white'}}  className="RefundOrderButton" onClick={()=>handleRemove()} >
        Remove Seller
    </button>):(
      
    <button style={{marginLeft:"90%", backgroundColor:'darkgreen', color:'white'}}  className="RefundOrderButton" onClick={()=>handleConnect()} >
    Add Seller
</button>
    )} 


<ToastContainer/>


<div className>
    <div >

        <p style={{fontSize:"600",fontWeight:"700",marginLeft:"13px",fontSize:"30px"}}> Seller Summary</p>

        
            <td style={{}}>
                <tr>
                    <p style={{fontSize:"20px",fontWeight:"bold",color:"darkgrey",marginTop:"10px"}}>Seller Name :  <span style={{fontWeight:"700",fontSize:"20px",color:"black"}}> {warehouseseller.name}</span> </p>
                </tr>
                <tr>
                    <p style={{fontSize:"20px",fontWeight:"bold",color:"darkgrey",marginTop:"5px"}}>Seller Email :  <span style={{fontWeight:"700",fontSize:"20px",color:"black"}}>{warehouseseller.email} </span> </p>
                </tr>
                <tr>
                    <p style={{fontSize:"20px",fontWeight:"bold",color:"darkgrey",marginTop:"5px"}}>Seller Phone Number :  <span style={{fontWeight:"700",fontSize:"20px",color:"black"}}>{warehouseseller.phonenumber}</span>  </p>
                </tr>
               
              
                <tr >
                    <p style={{fontSize:"20px",fontWeight:"bold",color:"darkgrey",marginTop:"5px"}}>Inventory :  <span style={{fontWeight:"700",fontSize:"20px",color:"black"}}>{warehousesellerinventory}</span></p>
                </tr>
             
                
                <tr>
                    <p style={{fontSize:"20px",fontWeight:"bold",color:"darkgrey",marginTop:"5px"}}>Sales Channel :  <span style={{fontWeight:"700",fontSize:"20px",color:"black"}}> Stock Logistics </span></p>
                </tr>
      
              
            </td>
        
                 
      

        

      
        

    </div>


</div>



<div >

<div className="OrderContents">




 
</div>

    
         
            
          </div>

          </div>
          </div>
          </div>

        
 </div>

 
)
}

export default ViewSeller