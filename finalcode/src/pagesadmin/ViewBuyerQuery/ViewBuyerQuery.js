import "./ViewBuyerQuery.css"
import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {Navbar,Sidebar, Header} from "../../componentsadmin";
import { useStateContext } from '../../context/ContextProvider';
import {CardMedia} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import { confirm } from "react-confirm-box";
import {useDispatch} from 'react-redux';
import {deactivateSeller,reactivateSeller} from '../../actions/admin'

const ViewProduct = () => { 
  const authdata = JSON.parse(localStorage.getItem('adminprofile'));
  const sellerdata = JSON.parse(localStorage.getItem('buyerqueries'));

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

            if(seller._id==id){
                console.log(seller)
                setSellerItem(seller)
            }
      });

   
   

  };

  const handleDeactivate=async (options)=>{
    


        const result = await confirm("Are you sure? You want to deactivate this Seller", options);
        if (result) {
          console.log("You click yes!");
     

          const data=await dispatch(deactivateSeller({id}))
          if(data.message="OK"){
              window.location.href=`/Sellers/admin/${useremail}`; 

          }
        
          return;
        }
        console.log("You click No!");  

  }

  const handleReactivate=async (options)=>{
    
    

        const result = await confirm("Are you sure? You want to Reactivate", options);
        if (result) {
          console.log("You click yes!");
     

          const data=await dispatch(reactivateSeller({id}))

          if(data.message="OK"){
            window.location.href=`/Sellers/admin/${useremail}`; 

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

    <Header title="Buyer Contact"/>


</div>



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

        <p style={{fontWeight:"700",color:'gray',fontSize:"20px"}}> Contact Summary </p>

        <p style={{fontWeight:"600",color:'gray'}}>Seller Email <span style={{fontWeight:"800",color:'black'}}>: {selleritem.email}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Seller Name <span style={{fontWeight:"800",color:'black'}}>: {selleritem.name}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}>Title <span style={{fontWeight:"800",color:'black'}}>: {selleritem.title}</span></p>
        </div>
     

        <div style={{marginLeft:"30%"}}>

        </div>

      

      
        

    </div>

    <div>

    <p style={{fontWeight:"600",color:'gray',marginTop:"30px",marginLeft:"20px",fontSize:"25px"}}>Message</p>
    <p style={{fontWeight:"600",color:'black',marginTop:"30px",marginLeft:"20px",fontSize:"20px"}}>{selleritem.message}</p>

    </div>

 

</div>




     




           
                </div>
            
          </div>

    </div>
    </div>
)
}

export default ViewProduct;