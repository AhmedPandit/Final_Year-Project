import "./ViewWarehouse.css"
import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {Navbar,Sidebar, Header} from "../../componentsadmin";
import { useStateContext } from '../../context/ContextProvider';
import {CardMedia} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import { confirm } from "react-confirm-box";
import {useDispatch} from 'react-redux';
import {deactivateWarehouse,reactivateWarehouse} from '../../actions/admin'

const ViewProduct = () => { 
  const authdata = JSON.parse(localStorage.getItem('adminprofile'));
  const sellerdata = JSON.parse(localStorage.getItem('adminwarehouse'));

  console.log(authdata);
  console.log(sellerdata)
  const dispatch=useDispatch();

  const { user,id} = useParams("");


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [selleritem,setSellerItem]=useState({});
  const [inventoryitem,setSellerInventory]=useState([]);
  const [orderitem,setSellerOrders]=useState([]);
  const [allsellers,setSellerSellers]=useState([]);

  // console.log([inddata]);

  const getiddata = async () => {

    const tosend={
        data:user
    }

    console.log(authdata);
    // const data=await dispatch(getuser(tosend));
    setUserName(authdata.name);
    setUserEmail(authdata.email);

    console.log(sellerdata)
    

     Object.values(sellerdata).map((seller) => {

            if(seller.email==id){
                setSellerItem(seller)
                setSellerInventory(seller.inventory)
                setSellerOrders(seller.orders);
                setSellerSellers(seller.sellers);
            }
      });

    console.log(selleritem +"Sncasacaks");
   

  };

  const handleDeactivate=async (options)=>{
    


        const result = await confirm("Are you sure? You want to deactivate this Warehouse", options);
        if (result) {
          console.log("You click yes!");
     

          const data=await dispatch(deactivateWarehouse({id}))
          if(data.message="OK"){
              window.location.href=`/Warehouses/admin/${useremail}`; 

          }
        
          return;
        }
        console.log("You click No!");  

  }

  const handleReactivate=async (options)=>{
    
    

        const result = await confirm("Are you sure? You want to Reactivate this warehouse", options);
        if (result) {
          console.log("You click yes!");
     

          const data=await dispatch(reactivateWarehouse({id}))

          if(data.message="OK"){
            window.location.href=`/Warehouses/admin/${useremail}`; 

        }
          return;
        }
        console.log("You click No!");  



  }

  useEffect(() => {
      setTimeout(getiddata)
  }, [id]);




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
                      <Navbar username={username} email={useremail} />
                  </div>
                 
                  <div style={{marginLeft:'10px',marginTop:'20px'}}>
                    

<div className="upperdiv">

    <Header title="Warehouse Details"/>


</div>


 {selleritem.accountstanding=="activated" ? ( <button style={{marginLeft:"85%", backgroundColor:"darkred", color:'white'}} onClick={handleDeactivate}  className="RefundOrderButton">
 Deactivate Account
</button>):(<button style={{marginLeft:"85%", backgroundColor:"darkgreen", color:'white'}} onClick={handleReactivate}  className="RefundOrderButton">
 Reactivate Account
</button>)} 
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

        <p style={{fontWeight:"600",color:'gray'}}>Warehouse Email <span style={{fontWeight:"800",color:'black'}}>: {selleritem.email}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Warehouse Name <span style={{fontWeight:"800",color:'black'}}>: {selleritem.name}</span></p>
        </div>
     

        <div style={{marginLeft:"30%"}}>

        </div>

      

      
        

    </div>

 

</div>


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

        <p style={{fontWeight:"700",color:'gray',fontSize:"20px"}}> Warehouse Details </p>

        <p style={{fontWeight:"600",color:'gray'}}>Warehouse Area <span style={{fontWeight:"800",color:'black'}}>: {selleritem.warehousearea}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Warehouse Location <span style={{fontWeight:"800",color:'black'}}>: {selleritem.location} / {selleritem.state}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Warehouse Handle Time <span style={{fontWeight:"800",color:'black'}}>: {selleritem.warehousehandletime}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Warehouse Status <span style={{fontWeight:"800",color:'black'}}>: {selleritem.accountstanding}</span></p>
        </div>
     

        <div style={{marginLeft:"30%"}}>

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
{ Object.keys(inventoryitem).length===0 ?(
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
                                  
                                  }

        
 




           
                </div>
            
          </div>

    </div>
    </div>
)
}

export default ViewProduct;