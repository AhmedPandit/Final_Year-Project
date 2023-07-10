import "./ViewOrder.css"
import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useDispatch} from 'react-redux';
import { Textfield } from "../../componentswarehouse";
import {Container,Grid,Typography,Button} from "@material-ui/core";
import {Navbar,Sidebar, Header} from "../../componentswarehouse";
import { useStateContext } from '../../context/ContextProvider';
import {CardMedia} from '@material-ui/core';
import {deliverorder,shiporder,cancelorder} from '../../actions/orders';
import { confirm } from "react-confirm-box";
import * as Yup from "yup";
import { Formik,Form } from "formik";
import { FormButton } from "../../components";

const FORM_VALIDATION=Yup.object().shape({
    shippingservice: Yup.string().required("required"),
  
    trackingid: Yup.string().required("required"),
  
  
})

const INITIAL_FORM_STATE={
  
    shippingservice:"",
    trackingid:"",
   
};

const ViewOrder = () => { 
  const dispatch=useDispatch();
  const authdata = JSON.parse(localStorage.getItem('wareprofile'));

  const { userid,order} = useParams("");


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");
  const [orderitem,setOrderItem]=useState({});
  const [shippingdetails,setShippingdetails]=useState("notactive");

  // console.log([inddata]);

  const getiddata = async () => {

    const tosend={
        data:userid
    }
    console.log(authdata);
    // const data=await dispatch(getuser(tosend));
    console.log('here')
    console.log(order)
    setUserName(authdata.name);
    setUserEmail(authdata.email);
    setUserPic(authdata.image)
    authdata.orders.map((item)=>{
        if (item._id==order)
        {
            setOrderItem(item)
            console.log(orderitem);
        }

    })   
    

  };

  useEffect(() => {
      setTimeout(getiddata, 1000)
  }, [userid]);


  const handleCancelOrder=async (item,options)=>{

    const result = await confirm("Are you sure You want to cancel Order?", options);
    if (result) {
      console.log("You click yes!");
      
      console.log(item)
      await dispatch(cancelorder(item))
      window.location.href=`/Orders/warehouse/${useremail}`
      return;
    }
    console.log("You click No!");    
 
    

  }

  const handleDeliverOrder=async (item,options)=>{

    const result = await confirm("Are you sure You want to mark this order as delivered?", options);
    if (result) {
      console.log("You click yes!");
      
      console.log(item)
      await dispatch(deliverorder(item))
      window.location.href=`/Orders/warehouse/${useremail}`
      return;
    }
    console.log("You click No!");    
 
    

  }

  const handleShipOrder= ()=>{

   setShippingdetails("active")
    
 

  }
  const handleCancelShip= ()=>{

    setShippingdetails("notactive")
     
  
 
   }
  const handleSubmit=async(values,options)=>{
    const result = await confirm("Are you sure You want to ship Order?", options);
    if (result) {
        
        const order={...orderitem,shippingservice:values.shippingservice,trackingid:values.trackingid}

        console.log(order);
        const data=await dispatch(shiporder(order))
        if(data.message=="Ordershipped"){

       
        window.location.href=`/Orders/warehouse/${useremail}`
        }
        else{
            console.log("Order Cannot be Shipped")
        }
      return;
    }

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

    <Header title="Order Details"/>


</div>


<div className="middlediv">
    <div style={{
          color: "rgba(0, 0, 0, 0.886)",
          backgroundColor: "white",
          padding: "7px",
          margin: "5px",
          borderRadius: "10px",
          display:'flex',
          flexDirection:'row',
          width: "95%",
          marginLeft:"20px",
          webkitBoxShadow:"2px 4px 10px 1px rgba(0,0,0,0.47)",
           boxShadow: "2px 4px 10px 1px rgba(201,201,201,0.47)"

    }}>
        <div style={{width:"60%"}}>

        <p style={{fontWeight:"700",color:'gray',fontSize:"20px",marginBottom:"10px"}}> Order Summary </p>
        <p style={{fontWeight:"600",color:'gray'}}>Status <span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.status}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Buyer Name <span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.buyername}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Buyer Email <span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.buyeremail}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Buyer Shipping Address <span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.buyershippingaddress}</span></p>

        </div>

        <div style={{marginTop:"40px",marginLeft:"100px"}}>

        <p style={{fontWeight:"600",color:'gray'}}>Purchase Date<span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.buyerpurchasedata}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}> Sales Channel<span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>Stock Logistics</span></p>
        <p style={{fontWeight:"600",color:'gray'}}> Sold By<span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.creator}</span></p>
        {orderitem.status=="shipped"?( <div>
        <p style={{fontWeight:"600",color:'gray'}}> Tracking Service<span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.shippingservice}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}> Tracking Id<span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.trackingid}</span></p>
        </div>):("")}
        {orderitem.status=="delivered"?( <div>
        <p style={{fontWeight:"600",color:'gray'}}> Tracking Service<span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.shippingservice}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}> Tracking Id<span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.trackingid}</span></p>
        </div>):("")}
       
      

        </div>

      

      
        

    </div>

 

</div>



<div className="OrderContents">
<p className="DivHeading"> Order Details </p>

<div style={{
         marginTop:"20px",
         marginLeft:'20px',
         display: "flex",
         height: "40px",
         flexDirection: "row",
         width: "95%",
        backgroundColor:'white'
    }}>

<p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px",width:"25%"}}> Product Name</p>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px",width:"25%"}}> Quantity</p>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px",width:"25%"}}>Unit Price</p>
        <p style={{fontWeight:"600",marginLeft:"5px",marginRight:"100px",width:"25%"}}> Fulfillment By</p>

    </div>



</div>

 { Object.keys(orderitem).length===0 ?(
    console.log("here"),
<p>No data to show</p>
 ):(
                                   

                        

 
            <div style={{
        marginTop:"20px",
        marginLeft:'20px',
        display: "flex",
        height: "auto",
        flexDirection: "row",
        width: "95%",
        backgroundColor:'white'
        }}>
       
       <p style={{fontWeight:"600",marginLeft:"5px",width:"25%"}}> {orderitem.productname}</p>
        <p style={{fontWeight:"600",marginLeft:"5px",width:"25%"}}> {orderitem.productquantity}</p>
        <p style={{fontWeight:"600",marginLeft:"5px",width:"25%"}}>{orderitem.productprice}</p>
        <p style={{fontWeight:"600",marginLeft:"5px",width:"25%"}}> {orderitem.shippingmethod}</p>

        </div>

        


 )
                                  
                                  }
{
    shippingdetails=="active"?(<div style={{marginTop:"20px",marginLeft:"20px",marginBottom:"20px"}}>   <Formik initialValues={{...INITIAL_FORM_STATE}} validationSchema={FORM_VALIDATION}
        onSubmit={handleSubmit}>

              {({
                    values,
                    errors,
                    handleChange,
                    handleBlur,
                    touched,
                    handleSubmit

                   
                    })=>(

    <Form style={{marginLeft:"30%"}}>

        <Grid container spacing={2}>

            <Grid item xs={12}>

                <Typography >
                   <p style={{fontSize:"20px",fontWeight:"550"}}>Shipping Information</p> 
                </Typography>
            </Grid>


            <Grid item xs={4}>
                    <Textfield name="shippingservice" 
                    label="Shipping Service"/>
            </Grid>
            <Grid item xs={4}>
                    <Textfield name="trackingid" 
                    label="Tracking id"/>
            </Grid>
        </Grid>

        <div style={{display:'flex',flexDirection:"row",marginTop:"20px"}}>

        <Grid item xs={2}>
        <button style={{marginLeft:"2%", backgroundColor:"white", color:'black',width:"90%",marginRight:"10px"}} onClick={()=>handleCancelShip()}  className="RefundOrderButton">
                            Cancel
                            </button>
                            </Grid>
        <Grid item xs={2}>
                                   <FormButton >
                                        Ship Product
                                   </FormButton>
                            </Grid>
                            </div>
            
            </Form>
                            )}
                </Formik>
                </div>
)
:("")
}
{orderitem.status=="pending" && shippingdetails=="notactive"?(<div style={{display:"flex",flexDirection:'row',marginTop:"20px"}}>

<button style={{marginLeft:"72%", backgroundColor:"white", color:'black',width:"10%"}}onClick={()=>handleCancelOrder(orderitem)}  className="RefundOrderButton">
        Cancel Order
    </button>


    <button style={{marginLeft:"2%", backgroundColor:"darkgreen", color:'white',width:"10%"}} onClick={()=>handleShipOrder()}  className="RefundOrderButton">
       Ship Order
    </button>

</div>):("")}

{orderitem.status=="shipped"?(<div style={{display:"flex",flexDirection:'row',marginTop:"20px"}}>
<button style={{marginLeft:"72%", backgroundColor:"darkgreen", color:'white',width:"10%"}}onClick={()=>handleDeliverOrder(orderitem)}  className="RefundOrderButton">
        Mark As Delivered
    </button>
</div>):("")}




           
                </div>
            
          </div>

          </div>
     

  </div>
)
}

export default ViewOrder;