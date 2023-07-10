import "./ViewFoundWarehouse.css"
import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar, Header} from "../../components";
import { useStateContext } from '../../context/ContextProvider';
import {MDBTableBody} from 'mdb-react-ui-kit';
import {CardMedia} from '@material-ui/core';
import {getwarehouseforuser,adduserinwarehouse} from "../../actions/warehouse";
import { confirm } from "react-confirm-box";

const ViewFoundWarehouset = () => { 
  const dispatch=useDispatch();
  const authdata = JSON.parse(localStorage.getItem('profile'));
  const warehousedata = JSON.parse(localStorage.getItem('setwarehouse'));
  
  console.log(warehousedata);

  const { userid,order} = useParams("");



  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");


  // console.log([inddata]);

  const getiddata = async () => {

    const tosend={
        data:userid
    }
    console.log(authdata);
    // const data=await dispatch(getuser(tosend));
    console.log('here')
    setUserName(authdata.name);
    setUserEmail(authdata.email);
    setUserPic(authdata.image)
   
    

  };

  useEffect(() => {
      setTimeout(getiddata, 1000)
  }, [userid]);


  const handleConnect=async(options)=>{

    const result = await confirm("Are you sure You want to add this warehouse?", options);
         if (result) {
           console.log("You click yes!");
           
           const warehouseemail=warehousedata.warehouseemail;
            console.log("here")
            await dispatch(adduserinwarehouse({warehouseemail,useremail}));
            console.log("here")
            window.location.href=`/ViewWarehouses/${useremail}`
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

    <Header title="View Warehouse"/>


</div>
<div style={{
         marginTop:"20px",
         marginLeft:'20px',
         
         height: "auto",
        
         width: "95%",
         webkitBoxShadow:"2px 4px 3px 1px rgba(0,0,0,0.47)",
         boxShadow: "2px 4px 10px 1px rgba(201,201,201,0.47)"
    }}>
      
      <div style={{display:'flex',flexDirection:"row"}}>
    
        <div >
           
            <p style={{marginTop:"10px",marginLeft:"10px",fontSize:"large",color:"darkgrey",fontWeight:'600'}}>Warehouse Name</p>
            <p style={{marginTop:"5px",marginLeft:"10px",fontSize:"large",color:"black",fontWeight:'600'}}>{warehousedata.warehousename}</p>
            <p style={{marginTop:"10px",marginLeft:"10px",fontSize:"large",color:"darkgrey",fontWeight:'600'}}>Warehouse Phone Number</p>
            <p style={{marginTop:"5px",marginLeft:"10px",fontSize:"large",color:"black",fontWeight:'600'}}>{warehousedata.warehousephonenumber}</p>
            <p style={{marginTop:"10px",marginLeft:"10px",fontSize:"large",color:"darkgrey",fontWeight:'600'}}>Warehouse Location</p>
            <p style={{marginTop:"5px",marginLeft:"10px",fontSize:"large",color:"black",fontWeight:'600'}}>{warehousedata.warehouselocation}</p>
            <p style={{marginTop:"10px",marginLeft:"10px",fontSize:"large",color:"darkgrey",fontWeight:'600'}}>Warehouse State</p>
            <p style={{marginTop:"5px",marginLeft:"10px",fontSize:"large",color:"black",fontWeight:'600'}}>{warehousedata.state}</p>
          

      

            </div>

            <div style={{marginLeft:"15%"}}>
            <div>
            <p style={{marginTop:"10px",marginLeft:"10px",fontSize:"large",color:"darkgrey",fontWeight:'600'}}>Warehouse Account Health</p>
            <p style={{marginTop:"5px",marginLeft:"10px",fontSize:"large",color:"black",fontWeight:'600'}}>{warehousedata.warehouseaccounthealth}</p>
            <p style={{marginTop:"10px",marginLeft:"10px",fontSize:"large",color:"darkgrey",fontWeight:'600'}}>Warehouse Packaging Charges</p>
            <p style={{marginTop:"5px",marginLeft:"10px",fontSize:"large",color:"black",fontWeight:'600'}}>{warehousedata.warehousepackagingcharges}</p>
            <p style={{marginTop:"10px",marginLeft:"10px",fontSize:"large",color:"darkgrey",fontWeight:'600'}}>Warehouse Shipping Charges</p>
            <p style={{marginTop:"5px",marginLeft:"10px",fontSize:"large",color:"black",fontWeight:'600'}}>{warehousedata.warehouseshippingcharges}</p>
            <p style={{marginTop:"10px",marginLeft:"10px",fontSize:"large",color:"darkgrey",fontWeight:'600'}}>Warehouse Area</p>
            <p style={{marginTop:"5px",marginLeft:"10px",fontSize:"large",color:"black",fontWeight:'600'}}>{warehousedata.warehousearea} square feet</p>
            <p style={{marginTop:"10px",marginLeft:"10px",fontSize:"large",color:"darkgrey",fontWeight:'600'}}>Warehouse Handle Time</p>
            <p style={{marginTop:"5px",marginLeft:"10px",fontSize:"large",color:"black",fontWeight:'600'}}>{warehousedata.warehousehandletime}</p>
            </div>
            </div>
            <div style={{marginLeft:"15%"}}>
            <CardMedia className="rounded-full h-24 w-24" style={{height:'200px', width:'200px',border:"2px solid lightgray"}} image={warehousedata.warehouseimage} />
            <p style={{fontWeight:"600",marginLeft:"1px",marginTop:"15px"}}>{warehousedata.warehouseemail}</p>
            </div>

            </div>
          <div className="buttondiv">


<button style={{marginLeft:"83%", width:"10%",backgroundColor:"darkgreen", color:'white'}} onClick={handleConnect}  className="RefundOrderButton">
    Connect
</button>

</div>
            

        </div>
   









 


           
            </div>
            
       </div>

    </div>
     

  </div>
)
}

export default ViewFoundWarehouset;