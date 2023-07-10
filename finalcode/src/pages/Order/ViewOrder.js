import "./ViewOrder.css"
import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar, Header} from "../../components";
import { useStateContext } from '../../context/ContextProvider';
import {MDBTableBody} from 'mdb-react-ui-kit';
import {CardMedia} from '@material-ui/core';
import * as Yup from "yup";
import {Container,Grid,Typography,Button} from "@material-ui/core";
import { Formik,Form } from "formik";
import {getorder} from '../../actions/orders'
import {shiporderfromseller,cancelorderseller,refundorderseller} from '../../actions/orders'
import { Select } from "../../components";
import { FormButton } from "../../components";
import { confirm } from "react-confirm-box";
import { ToastContainer, toast } from 'react-toastify';


const authdata = JSON.parse(localStorage.getItem('profile'));

console.log(authdata)

const ViewProduct = () => { 

    const FORM_VALIDATION=Yup.object().shape({
        shippingmethod: Yup.string().required("required"),
      
      
      
    })
    
    const INITIAL_FORM_STATE={
      
        shippingmethod:"",
       
       
    };
    
  const dispatch=useDispatch();


  const { userid,orderid,productid} = useParams("");


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");
  const [orderitem,setOrderItem]=useState({});
  const [productitem,setProductItem]=useState({});
  const [shippingwarehouses,setShippingWarehouses]=useState(0);
  const [shippingmethod,setShippingMethod]=useState({
     
  })

const updateShippingMethod = (shippingwarehouses) => {
  const warehouses = [...shippingwarehouses]; // Create a copy of the shipping warehouses array
  const method = { ...shippingmethod }; // Create a copy of the shipping method object

  // Loop through the warehouses and add them to the shipping method object
  warehouses.forEach((warehouse, index) => {
    if(warehouse.status=='pending') {
      console.log(warehouse.status);
    }
    else{
    method[`${warehouse.email}`] = warehouse.email; // Use a dynamic key name to add the warehouse name to the shipping method object
    setShippingWarehouses(shippingwarehouses+1);
    }
  });

  setShippingMethod(method); // Update the shipping method state with the new data
};

  // console.log([inddata]);

  const getiddata = async () => {

    const orders=JSON.parse(localStorage.getItem('orderprofile'));

    console.log(orders)

    let order={};

     for (let key in orders){
        if (orders[key]._id==orderid)
        {
            
            console.log(orders[key])
            order=orders[key]
            break;
          
          
        }

    }
    console.log(order)
    setOrderItem(order)
    console.log(orderitem)
    console.log('here')
    setUserName(authdata.name);
    setUserEmail(authdata.email);
    setUserPic(authdata.image)
    updateShippingMethod(authdata.warehouses)
    
    console.log(authdata);
    const tosend={
        data:productid
    }
 
    
    const product= await dispatch(getorder(tosend));
    console.log(product)
    setProductItem(product)
    

  };

  useEffect(() => {
      setTimeout(getiddata, 1000)
  }, [userid]);


  
  const handleCancel=async (options)=>{
    


    const result = await confirm("Are you sure? You want to Cancel this Order", options);
    if (result) {
      console.log("You click yes!");
 

      const data=await dispatch(cancelorderseller({orderid}))
      if(data.message=="OK"){
          window.location.href=`/Orders/${useremail}`; 

      }
    
      return;
    }
    console.log("You click No!");  

}
const handleRefund=async (options)=>{
    


  const result = await confirm("Are you sure? You want to refund this Order", options);
  if (result) {
    console.log("You click yes!");

    console.log(orderid);


    const data=await dispatch(refundorderseller({orderid}))
    if(data.message=="OK"){
        window.location.href=`/Orders/${useremail}`; 

    }
  
    return;
  }
  console.log("You click No!");  

}
  const handleSubmit=async(values,options)=>{
    console.log(values)

    const result = await confirm("Are you sure You want this warehouse to ship your product?", options);
    if (result) {
      console.log("You click yes!");
      const values={"_id":orderitem._id, "buyeremail":orderitem.buyeremail,
    "buyername":orderitem.buyername,"buyerpurchasedata":orderitem.buyerpurchasedata,"buyershippingaddress":orderitem.buyershippingaddress,"creator":useremail,"productcategory":productitem.productcategory,
    "productdescription":productitem.productdescription,"productid":productitem._id,"productname":productitem.productname,"productprice":productitem.productprice,"productquantity":productitem.productquantity,"shippingmethod":productitem.shippingmethod,"shippingservice":orderitem.shippingservice,"status":orderitem.status,
    "trackingid":orderitem.trackingid}
      
         const data=await dispatch(shiporderfromseller(values));
         if(data.message=="None"){
          toast.error('Warehouse Does not have the Product', {
            position: toast.POSITION.TOP_RIGHT
        });

         }
         else{
          console.log("done")
          window.location.href=`/Orders/${authdata.email}` 
         }
     
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

    <Header title="Order Details"/>


</div>

{orderitem.shippingmethod=="" && orderitem.status!="cancelled" ? (
    <div>
     <button style={{marginLeft:"85%", backgroundColor:"darkred", color:'white'}} onClick={handleCancel}  className="RefundOrderButton">
      Cancel Order
</button>
    </div>
  ):("")}

{orderitem.shippingmethod !="" && orderitem.status=="delivered" ? (
    <div>
     <button style={{marginLeft:"85%", backgroundColor:"darkred", color:'white'}} onClick={handleRefund}  className="RefundOrderButton">
      Refund Order
</button>
    </div>
  ):("")}


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

        <div style={{width:"70%"}}> 

        <p style={{fontWeight:"700",color:'gray',fontSize:"20px",marginBottom:"10px"}}> Order Summary </p>
        <p style={{fontWeight:"600",color:'gray'}}>Status <span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.status}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Buyer Name <span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.buyername}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Buyer Email <span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.buyeremail}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Buyer Shipping Address <span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.buyershippingaddress}</span></p>

        </div>

        <div style={{marginTop:"40px",marginLeft:"100px"}}>

        <p style={{fontWeight:"600",color:'gray'}}>Purchase Date<span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.buyerpurchasedata}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}> Total Amount<span style={{fontWeight:"800",color:'black',marginLeft:"5px"}}>{orderitem.amount}</span></p>

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
        <p style={{fontWeight:"600",marginLeft:"5px",width:"25%"}}>{productitem.productprice}</p>

        
        {orderitem.status=="cancelled"? ("Order is Cancelled"):(<div style={{width:"25%"}}> {orderitem.shippingmethod=="" &&  orderitem.status!="cancelled" ? (<div style={{marginTop:"20px",marginBottom:"20px",width:"100%"}}>   <Formik initialValues={{...INITIAL_FORM_STATE}} validationSchema={FORM_VALIDATION}
        onSubmit={handleSubmit}>

              {({
                    values,
                    errors,
                    handleChange,
                    handleBlur,
                    touched,
                    handleSubmit

                   
                    })=>(

    <Form style={{marginLeft:"1%"}}>

                            <Grid item xs={12}>

                            <Typography>
                                Choose Warehouse
                            </Typography>
                            </Grid>

                            <Grid item xs={12}>
                            <Select name="shippingmethod"
                            label="Shipping Method"
                            options={shippingmethod}
                            />
                            </Grid>

                            <Grid item xs={12}>
                                   <FormButton>
                                        Confirm Order
                                   </FormButton>
                            </Grid>

       
            
            </Form>
                            )}
                </Formik>
                </div>):(<p style={{fontWeight:"600",marginLeft:"5px",marginRight:"10px"}}> {orderitem.shippingmethod}</p>)} </div>) }
        

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