import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {BrowserRouter,Route,Routes} from "react-router-dom";
import {useDispatch} from 'react-redux';

import {Navbar,Sidebar,Footer, Header} from "../componentswarehouse";
import {Ecommerce,Employees,Stacked} from "./index"; 
import { useStateContext } from '../context/ContextProvider';
import { ordersData } from '../data/dummy';
import { getwarehouseuser } from '../actions/warehouse';
import {MDBTable,MDBTableHead,MDBTableBody,MDBTableRow,MDBCol,MDBContainer, MDBRow
,MDBBtn,MDBBtnGroup,MDBPagination,MDBPaginationItem,MDBPaginationLink} from 'mdb-react-ui-kit';
import './Orders.css'
import { Button } from '@material-ui/core';


const Orders = () => { 
  const dispatch=useDispatch();

  const { id } = useParams("");


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");
  const[user,setUser]=useState();
  const [activeButton, setActiveButton] = useState(1);
  const [orders,setUserOrders]=useState([]);
  const [displayorders,setDisplayOrders]=useState([]);
  const [toshow,settoshow]=useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // console.log([inddata]);

  const getiddata = async () => {
   

    const tosend={
        data:id
    }
    const data=await dispatch(getwarehouseuser(tosend));
    const authdata = JSON.parse(localStorage.getItem('wareprofile'));
    setUser(authdata);



 
    console.log('here')
    console.log(authdata);
    setUserName(authdata.name);
    setUserEmail(authdata.email);
    setUserPic(authdata.image)
    setUserOrders(authdata.orders);
    
    
    for (let i=0;i<authdata.orders.length;i++){
     
      if(authdata.orders[i].status==="pending"){
      setDisplayOrders(displayorders=>[...displayorders,authdata.orders[i]])
      }
  }

  };



  useEffect(() => {
      setTimeout(getiddata)
  }, [id]);
  

  const handleSearch = (e) => {
    
    e.preventDefault();

    setDisplayOrders([])
    settoshow([])



          
    for (let i=0;i<orders.length;i++){



      if(activeButton==1){
        if(orders[i].status=="pending"){
          console.log(orders[i])
        settoshow(toshow=>[...toshow,orders[i]])
        }

      }

    else if (activeButton==2){
          
  
      if(orders[i].status=="shipped"){
        console.log(orders[i])
      settoshow(toshow=>[...toshow,orders[i]])
      }
  

    }
    else if (activeButton==3){
          
  
      if(orders[i].status=="delivered"){
        console.log(orders[i])
      settoshow(toshow=>[...toshow,orders[i]])
      }
  

    }
    else if (activeButton==4){
          
  
      if(orders[i].status=="cancelled"){
        console.log(orders[i])
      settoshow(toshow=>[...toshow,orders[i]])
      }
  

    }

  }
  console.log(toshow)
    handleSort();

  
  };

  const handleSort=()=>{

    const filteredInventory = toshow.filter((item) =>
    item.buyername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(filteredInventory)
  setDisplayOrders(filteredInventory);

  }

  const handleViewOrder=(id)=>{

    window.location.href=`/Orders/ViewOrder/warehouse/${useremail}/${id}`
    

  }

  const handleFilter=(buttonId)=>{
  
    setActiveButton(buttonId)

    console.log(activeButton)

  }

  const handleReset=()=>{

  }



  const getordersdata=()=>{
    console.log("here");
    console.log(activeButton)
    setDisplayOrders([ ]);

    console.log(displayorders);

    if(activeButton==1){
      
       
      for (let i=0;i<orders.length;i++){

        if(orders[i].status=="pending"){
      
          setDisplayOrders(displayorders=>[...displayorders,orders[i]])
    
        }
        
  
      }
    }
    else if(activeButton==2) {
      
      for (let i=0;i<orders.length;i++){

        if(orders[i].status=="shipped"){
       
            setDisplayOrders(displayorders=>[...displayorders,orders[i]])
        }
          }
    }
    else if(activeButton==3) {
      
      for (let i=0;i<orders.length;i++){

        if(orders[i].status=="delivered"){
       
            setDisplayOrders(displayorders=>[...displayorders,orders[i]])
        }
          }
    }
    else  {
      for (let i=0;i<orders.length;i++){

        if(orders[i].status=="cancelled"){
       
            setDisplayOrders(displayorders=>[...displayorders,orders[i]])
        }
          }
    }
  }
  useEffect(() => {
    setTimeout(getordersdata, 1000)

}, [activeButton]);


  const renderPagination=()=>{
    if(currentpage===0){
      return(
        <MDBPagination>
           <MDBPaginationItem>
              <MDBPaginationLink>
                1
              </MDBPaginationLink>
           </MDBPaginationItem>
           <MDBPagination>
            <MDBBtn >
                Next
            </MDBBtn>
           </MDBPagination>
        </MDBPagination>
      )
    }
}

  const {activeMenu}=useStateContext();

  const [value,setValue]=useState("");
  const [sortvalue, setSortValue]=useState("");
  const sortoptions=["OrderID","CustomerName"]

  const [currentpage,setCurrentPage]=useState("");
  const [pagelimit]=useState(4)
 return (
  <div>
          <div className='flex relative dark:bg-main-dark-bg'>
                 
              {activeMenu ? (
                  <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
                    <  Sidebar  email={useremail} />
                  </div>
              ):(<div className='w-0 dark:bg-secondary-dark-bg'>
                     <Sidebar/>
                  </div>
              )}
              <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu? 'md:ml-72' :'flex-2'}`}>
                  <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                      <Navbar username={username} email={useremail} selectedfile={userpic}/>
                  </div>
                 
    
                  <MDBContainer style={{marginLeft:'10px', marginTop:'10px'}}>
                   <div style={{display:'flex',flexDirection:'row'}}>
                   <Header title='View Orders'/>
                   <form
                      style={{
                        marginLeft: "840px",
                        padding: "15px",
                        maxWidth: "700px",
                        display: "flex",
                        flexDirection: "row",
                      }}
                      onSubmit={handleSearch}
                    >
                      <input
                          type="text"
                          style={{
                            height: "35px",
                            padding: "5px",
                            borderRadius: "20px",
                            border: "1px solid black",
                          }}
                          className="form-control"
                          placeholder="Search By Buyer Name"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      {/* Buttons go here */}
                    </form>

                   </div>
               
        

                      <MDBCol size={12}>

                          <MDBBtnGroup>
                            <button  className={` ${activeButton == 1 ? "active" :"notactive"}`} onClick={()=>handleFilter(1)}>Pending</button>
                            <button  className={` ${activeButton == 2 ? "active" : "notactive"}`}   onClick={()=>handleFilter(2)}>Shipped</button>
                            <button  className={` ${activeButton == 3 ? "active" : "notactive"}`}  onClick={()=>handleFilter(3)}>Delivered</button>
                            <button  className={` ${activeButton == 4 ? "active" : "notactive"}`}  onClick={()=>handleFilter(4)}>Cancelled</button>
              
                          </MDBBtnGroup>
                          <hr class="solid"></hr>

                      </MDBCol>

                    
                    <div>
                        <MDBRow>
                          <MDBCol size={12}>
                              <MDBTable>
                                  <MDBTableHead >
                                        <tr style={{fontSize:'15px'}}>
                                         
                                          <th scope='col'>Customer Name</th>
                                          <th scope='col'>Product Name</th>
                                          <th scope='col'>Product Quantity</th>
                                          <th scope='col'>Amount</th>
                                       
                                        </tr>
                                  </MDBTableHead>
                                  {displayorders.length===0 ? (
                                    <MDBTableBody className='align-center mb-0'>
                                      <tr>
                                        <td colSpan={8} className='text-center mb-0'>
                                        <p style={{marginTop:"10px",fontSize:"20px",fontWeight:"bold",color:"darkgray"}}>No Data Found</p>
                                        </td>
                                      </tr>

                                    </MDBTableBody>
                                  ):(
                                    displayorders.map((item,index)=>(
                                      <MDBTableBody key={index}>

                                        <tr>
                                         
                                          <td className='selector' onClick={()=>handleViewOrder(item._id)}>{item.buyername}</td>
                                          <td>{item.productname}</td>
                                          <td>{item.productquantity}</td>
                                          <td>{item.productprice}</td>
                                         

                                        </tr>

                                      </MDBTableBody>
                                    ))
                                  )
                                  }
                              </MDBTable>
                          </MDBCol>
                        </MDBRow>
                      <div style={{marginLeft:'auto',padding:'15px',maxWidth:'400px',alignContent:'center'}}>{renderPagination()}</div>
                    </div>
                  </MDBContainer>

            
               </div>
          

          </div>
      

     
     

  </div>
)
}
export default Orders