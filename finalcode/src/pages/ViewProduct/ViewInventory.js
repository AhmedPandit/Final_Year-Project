import "./ViewInventory.css"
import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar, Header} from "../../components";
import { useStateContext } from '../../context/ContextProvider';
import {getuser} from "../../actions/user"
import {deleteinventory,seteditinventory} from '../../actions/products';
import {MDBTableBody} from 'mdb-react-ui-kit';
import {CardMedia} from '@material-ui/core';
import { confirm } from "react-confirm-box";

const ViewProduct = () => { 
    const dispatch=useDispatch();
  const authdata = JSON.parse(localStorage.getItem('profile'));

  const { userid,productid,status} = useParams("");


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");
  const [inventoryitem,setInventoryItem]=useState({});

  // console.log([inddata]);

  const getiddata = async () => {

    const tosend={
        data:userid
    }
    // const data=await dispatch(getuser(tosend));
    console.log('here')
    setUserName(authdata.name);
    setUserEmail(authdata.email);
    setUserPic(authdata.image)
    let itemto={};
    authdata.inventory.map((item)=>{
        if (item._id==productid)
        {
            itemto=item
            console.log(itemto);
        }

    })
    console.log(itemto);
    setInventoryItem({...itemto});
    
    
   
    

  };

  useEffect(() => {
      setTimeout(getiddata)
  }, [userid]);


const handleEdit=()=>{
    
    dispatch (seteditinventory(inventoryitem));
    
    window.location.href=`/Inventory/EditInventory/${useremail}/${inventoryitem._id}`

}
const handleRemove=async (options)=>{

    const result = await confirm("Are you sure? You want to delete your inventory", options);
    if (result) {
      console.log("You click yes!");
      
      await dispatch(deleteinventory(userid,productid))
      window.location.href=`/ViewProduct/${useremail}`; 
      return;
    }
    console.log("You click No!");    

}


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

    <Header title="Inventory Details"/>


</div>

<div className="buttondiv">
<button style={{marginLeft:"78%", backgroundColor:"white", color:'black'}} onClick={handleEdit}  className="RefundOrderButton">
        Edit Inventory
    </button>

    <button style={{marginLeft:"2%", backgroundColor:"darkred", color:'white'}} onClick={handleRemove}  className="RefundOrderButton">
        Remove Inventory
    </button>

</div>

<div className="middlediv">
    <div style={{
          color: "rgba(0, 0, 0, 0.886)",
          backgroundColor: "white",
          padding: "7px",
          margin: "5px",
          borderRadius: "10px",
         
          width: "95%",
          marginLeft:"20px",
          webkitBoxShadow:"2px 4px 10px 1px rgba(0,0,0,0.47)",
           boxShadow: "2px 4px 10px 1px rgba(201,201,201,0.47)"

    }}>

        <p style={{fontWeight:"700",color:'gray',fontSize:"20px"}}> Inventory Summary </p>
        <p style={{fontWeight:"600",color:'gray'}}>Status <span style={{fontWeight:"800",color:'black'}}>{inventoryitem.status}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Seller Email <span style={{fontWeight:"800",color:'black'}}>{useremail}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Seller Name <span style={{fontWeight:"800",color:'black'}}>{username}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Created At (Y/M/D) <span style={{fontWeight:"800",color:'black'}}>{inventoryitem.creationtime}</span></p>

      

      
        

    </div>

 

</div>




<div className="OrderContents">
<p className="DivHeading"> Inventory </p>

    <div style={{
         marginTop:"20px",
         marginLeft:'20px',
         display: "flex",
         flexDirection:"row",
         height: "60px",
         flexDirection: "row",
         width: "95%",
        backgroundColor:'white'
    }}>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px",width:"10%"}}>Image </p>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px",width:"24%"}}> Product Name</p>
       
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px",width:"15%"}}> Quantity</p>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px",width:"15%"}}>Unit Price</p>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px",width:"20%"}}> Fulfillment By</p>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px",width:"15%"}}> Space Occupied</p>
        

    </div>

</div>

 { Object.keys(inventoryitem).length===0 ?(
    console.log("here"),
<p>No data to show</p>
 ):(<div>
                                   
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
        <p style={{fontWeight:"600",marginLeft:"5px",width:"10%"}}><CardMedia style={{marginTop:"10px", height:'30', width:'30'}} className=" h-24 w-24" image={inventoryitem.image}/> </p>
        <p style={{fontWeight:"600",marginLeft:"5px",width:"24%"}}> {inventoryitem.productname}</p>
        <p style={{fontWeight:"600",marginLeft:"5px",width:"15%"}}> {inventoryitem.productquantity}</p>
        <p style={{fontWeight:"600",marginLeft:"5px",width:"15%"}}>{inventoryitem.productprice}</p>
        <p style={{fontWeight:"600",marginLeft:"5px",width:"20%"}}>{inventoryitem.shippingmethod}</p>
        <p style={{fontWeight:"600",marginLeft:"5px",width:"15%"}}>{inventoryitem.inventoryspace} square feet</p>

    </div>

                                      <p className="DivHeading" style={{marginTop:'30px'}}>Inventory Description </p>
                                      <p style={{marginBottom:"10%",marginLeft:"20px"}}>{inventoryitem.productdescription}</p>

                                      </div>
 )
                                  
                                  }




           
                </div>
            
          </div>

          </div>
     

  </div>
)
}

export default ViewProduct;