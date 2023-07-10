import "./ViewWarehouse.css"
import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {Navbar,Sidebar, Header} from "../../components";
import { useStateContext } from '../../context/ContextProvider';
import {CardMedia} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import { confirm } from "react-confirm-box";
import {useDispatch} from 'react-redux';
import {removesellerfromwarehouse} from "../../actions/warehouse";

const ViewProduct = () => { 
  const authdata = JSON.parse(localStorage.getItem('profile'));
  const dispatch=useDispatch();

  const { userid,warehouseid} = useParams("");


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");
  const [warehouseitem,setWarehouseItem]=useState({});
  const [inventoryitem,setWarehouseInventory]=useState([]);
  const [orderitem,setWarehouseOrders]=useState([]);

  // console.log([inddata]);

  const getiddata = async () => {

    const tosend={
        data:userid
    }

    console.log(authdata);
    console.log(warehouseid);
    // const data=await dispatch(getuser(tosend));
    setUserName(authdata.name);
    setUserEmail(authdata.email);
    setUserPic(authdata.image)
    authdata.warehouses.map((item)=>{
        if (item.email==warehouseid)
        {
            setWarehouseItem(item)
         
        }

    })
    setWarehouseInventory([])
    authdata.inventory.map((item)=>{
        if (item.shippingmethod==warehouseid )
        {
            setWarehouseInventory(inventoryitem=>[...inventoryitem,item])
         
        }

    })
    setWarehouseOrders([])

    authdata.orders.map((item)=>{
        if (item.shippingmethod==warehouseid && item.status=="pending" ) 
        {
            setWarehouseOrders(orderitem=>[...orderitem,item])
         
        }

    })

  };

  const handleRemove=async (options)=>{
    
    if(inventoryitem.length==0 && orderitem.length==0 ){

        const result = await confirm("Are you sure? You want to delete this warehouse", options);
        if (result) {
          console.log("You click yes!");
          const sellerid=useremail;
          const warehouseid=warehouseitem.email;

          await dispatch(removesellerfromwarehouse({sellerid,warehouseid}))
          window.location.href=`/ViewWarehouses/${useremail}`; 
          return;
        }
        console.log("You click No!");  


    }
    else{
        toast.error('Inventory and Pending Orders should be zero before removing an warehouse ', {
            position: toast.POSITION.TOP_RIGHT
        });

    }

  }

  useEffect(() => {
      setTimeout(getiddata)
  }, [userid]);




const {activeMenu}=useStateContext();
 return (
  <div>
          <div className='flex relative dark:bg-main-dark-bg'>
                 
              {activeMenu ? (
                  <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
                    <  Sidebar email={useremail} />
                  </div>
              ):(<div className='w-0 dark:bg-secondary-dark-bg'>
                     <Sidebar email={useremail} />
                  </div>
              )}
              <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu? 'md:ml-72' :'flex-2'}`}>
                  <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                      <Navbar username={username} email={useremail} selectedfile={userpic}/>
                  </div>
                 
                  <div style={{marginLeft:'10px',marginTop:'20px'}}>
                    

<div className="upperdiv">

    <Header title="Warehouse Details"/>


</div>


 <button style={{marginLeft:"85%", backgroundColor:"darkred", color:'white'}} onClick={handleRemove}  className="RefundOrderButton">
 Remove Warehouse
</button>
<ToastContainer/>


<div className="middlediv">
    <div style={{
          color: "rgba(0, 0, 0, 0.886)",
          backgroundColor: "white",
          padding: "7px",
          margin: "5px",
          borderRadius: "10px",
         display:"flex",
         flexDirection:'row',
          width: "95%",
          marginLeft:"20px",
          webkitBoxShadow:"2px 4px 10px 1px rgba(0,0,0,0.47)",
           boxShadow: "2px 4px 10px 1px rgba(201,201,201,0.47)"

    }}>
        <div>

        <p style={{fontWeight:"700",color:'gray',fontSize:"20px"}}> Warehouse Summary </p>
        <p style={{fontWeight:"600",color:'gray'}}>Status <span style={{fontWeight:"800",color:'black'}}>: {warehouseitem.status}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Warehouse Email <span style={{fontWeight:"800",color:'black'}}>: {warehouseitem.email}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Warehouse Name <span style={{fontWeight:"800",color:'black'}}>: {warehouseitem.name}</span></p>
        </div>
        <div style={{marginLeft:"15%",marginTop:"2%"}}>
        <p style={{fontWeight:"600",color:'gray'}}>Warehouse Area <span style={{fontWeight:"800",color:'black'}}>: {warehouseitem.warehousearea} square feet</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Shipping Time <span style={{fontWeight:"800",color:'black'}}>: {warehouseitem.warehousehandletime} days</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Packaging Charges<span style={{fontWeight:"800",color:'black'}}>: {warehouseitem.packagingcharges}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Shipping Charges <span style={{fontWeight:"800",color:'black'}}>: {warehouseitem.shippingcharges}</span></p>

        </div>

        <div style={{marginLeft:"30%"}}>
        <CardMedia style={{marginTop:"10px", height:'30', width:'30',border:"1px solid darkgray"}} className=" h-24 w-24 rounded-full" image={warehouseitem.image} />

        </div>

      

      
        

    </div>

 

</div>




<div className="OrderContents">
<p className="DivHeading"> Inventory Details </p>

<div style={{
         marginTop:"20px",
         marginLeft:'20px',
         display: "flex",
         height: "40px",
         flexDirection: "row",
         width: "95%",
        backgroundColor:'white'
    }}>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px"}}>Image </p>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px"}}> Product Name</p>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px"}}> Quantity</p>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px"}}>Unit Price</p>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px"}}> Fulfillment By</p>

    </div>

</div>
{warehouseitem.status=="active"?( Object.keys(inventoryitem).length===0 ?(
    console.log("here"),
<p style={{marginLeft:"20px",marginTop:"20px",fontSize:"30px",fontWeight:"bold",
                                color:"darkgray"}}>No data to show</p>
 ):(
     inventoryitem.map((item,index)=>(

        <div style={{
            marginTop:"20px",
            marginLeft:'20px',
            display: "flex",
            height: "auto",
            flexDirection: "row",
            width: "95%",
            webkitBoxShadow:"2px 4px 3px 1px rgba(0,0,0,0.47)",
            boxShadow: "2px 4px 10px 1px rgba(201,201,201,0.47)"
       }}>
           <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"50px"}}><CardMedia style={{marginTop:"10px", height:'30', width:'30'}} className=" h-24 w-24" image={item.image}/> </p>
           <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"170px"}}> {item.productname}</p>
           <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"140px"}}> {item.productquantity}</p>
           <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"150px"}}>{item.productprice}</p>
           <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"10px"}}>{item.shippingmethod}</p>
   
       </div>
                                
                                      ))  
 )
                                  
                                  ):(
                                    <p style={{marginLeft:"20px",marginTop:"20px",fontSize:"30px",fontWeight:"bold",
                                color:"darkgray"}}>Wait for acceptance</p>
                                  )}

        
 




           
                </div>
            
          </div>

    </div>
    </div>
)
}

export default ViewProduct;