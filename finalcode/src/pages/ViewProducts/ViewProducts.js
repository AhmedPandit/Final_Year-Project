import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useSelector} from 'react-redux';
import {MDBTable,MDBTableHead,MDBTableBody,MDBCol,MDBContainer, MDBRow
  ,MDBBtn,MDBBtnGroup,MDBPagination,MDBPaginationItem,MDBPaginationLink} from 'mdb-react-ui-kit';
import {getuser} from "../../actions/user"
import { useStateContext } from '../../context/ContextProvider';
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar, Header} from "../../components";
import { Button } from '@material-ui/core';
import './ViewProducts.css'

const ViewProducts = () => {

  

  const dispatch=useDispatch();

  const { id } = useParams("");


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");
  const[user,setUser]=useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeButton, setActiveButton] = useState(1);
  const [inventory,setUserInventory]=useState([]);
  const [toshow,settoshow]=useState([]);
  
  const [displayinventory,setDisplayInventory]=useState([]);

  // console.log([inddata]);
  const authdata = JSON.parse(localStorage.getItem('profile'));

  const getiddata = async () => {

    const tosend={
        data:id
    }
    const data=await dispatch(getuser(tosend));
   
    console.log(authdata);
    
    setUser(authdata);
    setUserInventory([]);
    setUserInventory(authdata.inventory);
    console.log(authdata.inventory);
    setDisplayInventory([])
    setUserName(authdata.name);
    setUserEmail(authdata.email);
    setUserPic(authdata.image)
    
    
    for (let i=0;authdata.inventory.length;i++){
      if(authdata.inventory[i].status=="active"){
      setDisplayInventory(displayinventory=>[...displayinventory,authdata.inventory[i]])
      }
  }

  };

  useEffect(() => {
      setTimeout(getiddata)
  }, [id]);

 
  const handleSearch = (e) => {
    
    e.preventDefault();

    setDisplayInventory([])
    settoshow([])



          
    for (let i=0;i<authdata.inventory.length;i++){



      if(activeButton==1){
        if(authdata.inventory[i].status=="active"){
          console.log(authdata.inventory[i])
        settoshow(toshow=>[...toshow,authdata.inventory[i]])
        }

      }

    else{
          
  
      if(authdata.inventory[i].status=="pending"){
        settoshow(toshow=>[...toshow,authdata.inventory[i]])
      }
  

    }

  }
  console.log(toshow)
    handleSort();

  
  };


  const handleSort=()=>{

    const filteredInventory = toshow.filter((item) =>
    item.productname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(filteredInventory)
  setDisplayInventory(filteredInventory);

  }


  const handleFilter=(buttonId)=>{
  
    setActiveButton(buttonId)

    console.log(activeButton)

  }

  const handleReset=()=>{

  }
  const handleViewInventory=(id)=>{
    console.log(id)
    window.location.href=`/Inventory/ViewInventory/${useremail}/${id}`

  }

  const getinventorydata=()=>{
    console.log("here");
    console.log(activeButton)
    setDisplayInventory([ ]);

    if(activeButton==1){
       
      for (let i=0;inventory.length;i++){

        if(inventory[i].status=="active"){
      
          setDisplayInventory(displayinventory=>[...displayinventory,inventory[i]])
    
        }
        
  
      }
    }
    else{
      for (let i=0;i<inventory.length;i++){

        if(inventory[i].status=="pending"){
       
            setDisplayInventory(displayinventory=>[...displayinventory,inventory[i]])
        }
          }
    }
  }
  useEffect(() => {
    setTimeout(getinventorydata)

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
  const products=useSelector((state)=>state.products)

  console.log(products);
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
                   <Header title='View Inventory'/>
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
                          placeholder="Search By Name"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      {/* Buttons go here */}
                    </form>

                   </div>
               

                      <MDBCol size={12}>

                          <MDBBtnGroup>
                            <button  className={` ${activeButton === 1 ? "active" : ""}`} onClick={()=>handleFilter(1)}>Active</button>
                            <button  className={` ${activeButton === 2 ? "active" : ""}`}   onClick={()=>handleFilter(2)}>Pending</button>
                          
                          </MDBBtnGroup>
                          <hr class="solid"></hr>

                      </MDBCol>

                    
                    <div>
                        <MDBRow>
                          <MDBCol size={12}>
                          <table>
                              <thead className='tablehead'>
                                        <tr style={{fontSize:'15px'}}>
                                          
                                          <th scope='col'>Product Name</th>
                                          <th scope='col'>Product Quantity</th>
                                          <th scope='col'>productprice</th>
                              
                            
                                        </tr>
                               </thead>
                                  {displayinventory.length===0 ? (
                                  <tbody>
                                      <tr>
                                        <td colSpan={8} className='text-center mb-0'>
                                        <p style={{marginTop:"10px",fontSize:"20px",fontWeight:"bold",color:"darkgray"}}>No Data Found</p>
                                        </td>
                                      </tr>

                                      </tbody>
                                  ):(
                                    displayinventory.map((item,index)=>(
                                      <tbody key={index}>

                                        <tr>
                                          <td scope='row' className='selector' onClick={()=>handleViewInventory(item._id)}> {item.productname}</td>
                                          <td >{item.productquantity}</td>
                                          <td >{item.productprice}</td>
                                        
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

export default ViewProducts;