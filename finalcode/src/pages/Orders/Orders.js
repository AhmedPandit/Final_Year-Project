import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar,Footer, Header} from "../../components";
import { useStateContext } from '../../context/ContextProvider';
import {getuser} from "../../actions/user"
import {getorders} from "../../actions/orders"
import {MDBTable,MDBTableHead,MDBTableBody,MDBCol,MDBContainer, MDBRow
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
    const data=await dispatch(getuser(tosend));
    const authdata = JSON.parse(localStorage.getItem('profile'));
    const orders=await dispatch(getorders(tosend));
    console.log("all order")
    console.log(orders.allorders);
    setUserOrders(orders.allorders);
    setUser(authdata);

 
    console.log('here')
    console.log(authdata);
    setUserName(authdata.name);
    setUserEmail(authdata.email);
    setUserPic(authdata.image)
    
    
    for (let i=0;i<orders.allorders.length;i++){
     
      if(orders.allorders[i].status==="pending"){
      setDisplayOrders(displayorders=>[...displayorders,orders.allorders[i]])
      }
  }

  };



  useEffect(() => {
      setTimeout(getiddata,1000)
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
    else if (activeButton==5){
          
  
      if(orders[i].status=="refunded"){
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

  const handleFilter=(buttonId)=>{
  
    setActiveButton(buttonId)

    console.log(activeButton)

  }

  const handleReset=()=>{

  }
  const handleViewOrder=(id,productid)=>{

    window.location.href=`/Orders/ViewOrder/${useremail}/${id}/${productid}`
    

  }

  const getordersdata=()=>{
    console.log("here");
    console.log(activeButton)
    setDisplayOrders([ ]);

    console.log(displayorders);
    console.log(orders);

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
      console.log(orders.length)
      
      for (let i=0;i<orders.length;i++){

        if(orders[i].status=="delivered"){
       
            setDisplayOrders(displayorders=>[...displayorders,orders[i]])
        }
          }
    }
    else if(activeButton==4) {
      console.log(orders.length)
      
      for (let i=0;i<orders.length;i++){

        if(orders[i].status=="cancelled"){
       
            setDisplayOrders(displayorders=>[...displayorders,orders[i]])
        }
          }
    }
    else  {
      for (let i=0;i<orders.length;i++){

        if(orders[i].status=="refunded"){
       
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
                            <button  className={` ${activeButton == 3 ? "active" : "notactive"}`}   onClick={()=>handleFilter(3)}>Delivered</button>
                            <button  className={` ${activeButton == 4 ? "active" : "notactive"}`}  onClick={()=>handleFilter(4)}>Cancelled</button>
                            <button  className={` ${activeButton == 5 ? "active" : "notactive"}`}  onClick={()=>handleFilter(5)}>Refunded</button>
                            
              
                          </MDBBtnGroup>
                          <hr class="solid"></hr>

                      </MDBCol>

                    
                    <div>
                        <MDBRow>
                          <MDBCol size={12}>
                              <table>
                                  <thead >
                                        <tr style={{fontSize:'15px'}}>
                                         
                                          <th scope='col'>Customer Name</th>
                                          <th scope='col'>Product Name</th>
                                          <th scope='col'>Product Quantity</th>
                                          <th scope='col'>Amount</th>
                                          <th scope='col'>Status</th>
                                        </tr>
                                  </thead>
                                  {displayorders.length===0 ? (
                                    <tbody className='align-center mb-0'>
                                      <tr>
                                        <td colSpan={8} className='text-center mb-0'>
                                        <p style={{marginTop:"10px",fontSize:"20px",fontWeight:"bold",color:"darkgray"}}>No Data Found</p>
                                        </td>
                                      </tr>

                                    </tbody>
                                  ):(
                                    displayorders.map((item,index)=>(
                                      <tbody key={index}>

                                        <tr>
                                         
                                          <td className='selector' onClick={()=>handleViewOrder(item._id,item.productid)}>{item.buyername}</td>
                                          <td>{item.productname}</td>
                                          <td>{item.productquantity}</td>
                                          <td>{item.amount}</td>
                                          <td>{item.status=="pending" && item.shippingmethod==""?("Uninitiated"):("Initiated")}</td>
                                        </tr>

                                      </tbody>
                                    ))
                                  )
                                  }
                              </table>
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