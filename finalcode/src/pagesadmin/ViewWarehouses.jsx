import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useSelector} from 'react-redux';
import {MDBTable,MDBTableHead,MDBTableBody,MDBTableRow,MDBCol,MDBContainer, MDBRow
  ,MDBBtn,MDBBtnGroup,MDBPagination,MDBPaginationItem,MDBPaginationLink} from 'mdb-react-ui-kit';
import {getadminwarehouse} from "../actions/admin"
import { useStateContext } from '../context/ContextProvider';
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar, Header} from "../componentsadmin";
import { Button } from '@material-ui/core';

const ViewSellers = () => {
  const dispatch=useDispatch();

  const { id } = useParams(" ");

 const authdata = JSON.parse(localStorage.getItem('adminprofile'));



  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");
  const[user,setUser]=useState();
  const [activeButton, setActiveButton] = useState(1);
  const [sellers,setUserSellers]=useState([]);
  const [displayseller,setDisplaySeller]=useState([]); 
  const [toshow,settoshow]=useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // console.log([inddata]);

  const getiddata = async () => {

    const tosend={
        data:id
    }

    setUser(authdata.email);
 
    const data=await dispatch(getadminwarehouse(tosend));

    setUserSellers(data);

    console.log(sellers);
   

    for (let i=0;i<data.length;i++){
    
        if(data[i].accountstanding=="activated"){
            console.log(data[i])
          setDisplaySeller(displayseller=>[...displayseller,data[i]])
    
        }
        
  
      }
    console.log(displayseller);


    

  };

  useEffect(() => {
      setTimeout(getiddata, 1000)
  }, [id]);




  
  const handleSearch = (e) => {
    
    e.preventDefault();

    setDisplaySeller([])
    settoshow([])



          
    for (let i=0;i<sellers.length;i++){


      if(activeButton==1){
       

          if(sellers[i].accountstanding=="activated"){
            settoshow(toshow=>[...toshow,sellers[i]])
      
          }
          
    
        
      }
      else{
       
          if(sellers[i].accountstanding=="deactivated"){
            settoshow(toshow=>[...toshow,sellers[i]])
        
            }
      }

  }
  console.log(toshow)
    handleSort();

  
  };


  const handleSort=()=>{

    const filteredInventory = toshow.filter((item) =>
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(filteredInventory)
  setDisplaySeller(filteredInventory);

  }
  const handleFilter=(buttonId)=>{
  
    setActiveButton(buttonId)

    console.log(activeButton)

  }

  const handleReset=()=>{

  }
  const handleViewSeller=(id)=>{
    console.log(id)
    window.location.href=`/ViewWarehouse/admin/${user}/${id}`

  }

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



  const getsellerdata=()=>{
    console.log("here");
    console.log(activeButton)
    setDisplaySeller([]);

    if(activeButton==1){
       
      for (let i=0;i<sellers.length;i++){
        if(sellers[i].accountstanding=="activated"){
            setDisplaySeller(displayseller=>[...displayseller,sellers[i]])
    
        }
        
  
      }
    }
    else{
      for (let i=0;i<sellers.length;i++){
        if(sellers[i].accountstanding=="deactivated"){
                setDisplaySeller(displayseller=>[...displayseller,sellers[i]])
      
          }
        
  
      }
    }
  }
  useEffect(() => {
    setTimeout(getsellerdata, 1000)

}, [activeButton]);




  return (
    <div>
          <div className='flex relative dark:bg-main-dark-bg'>
                 
              {activeMenu ? (
                  <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
                    <  Sidebar  email={authdata.email} />
                  </div>
              ):(<div className='w-0 dark:bg-secondary-dark-bg'>
                     <Sidebar/>
                  </div>
              )}
              <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu? 'md:ml-72' :'flex-2'}`}>
                  <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                      <Navbar username={authdata.name} email={authdata.email} />
                  </div>
                 
    
                  <MDBContainer style={{marginLeft:'10px', marginTop:'10px'}}>
                   <div style={{display:'flex',flexDirection:'row'}}>
                   <Header title='View Warehouses'/>
                 

                   </div>
               
                   <form
                      style={{
                        marginLeft: "980px",
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
                          placeholder="Search By Email"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      {/* Buttons go here */}
                    </form>

                      <MDBCol size={12}>

                          <MDBBtnGroup>
                            <button  className={` ${activeButton === 1 ? "active" : ""}`} onClick={()=>handleFilter(1)}>Active Warehouses</button>
                            <button  className={` ${activeButton === 2 ? "active" : ""}`}   onClick={()=>handleFilter(2)}>Deactivated Warehouses</button>
                          
                          </MDBBtnGroup>
                          <hr class="solid"></hr>

                      </MDBCol>

                    
                    <div>
                        <MDBRow>
                          <MDBCol size={12}>
                              <MDBTable>
                                  <MDBTableHead >
                                        <tr style={{fontSize:'15px'}}>
                                          
                                          <th scope='col'>Email</th>
                                          <th scope='col'>Name</th>
                                          <th scope='col'>Phone Number</th>
                                         
                            
                                        </tr>
                                  </MDBTableHead>
                                  {displayseller.length===0 ? (
                                    <MDBTableBody className='align-center mb-0'>
                                      <tr>
                                        <td colSpan={8} className='text-center mb-0'>
                                        <p style={{marginTop:"10px",fontSize:"20px",fontWeight:"bold",color:"darkgray"}}>No Data Found</p>
                                        </td>
                                      </tr>

                                    </MDBTableBody>
                                  ):(
                                   displayseller.map((item,index)=>(
                                      <MDBTableBody key={index}>

                                        <tr>
                                          <td scope='row' className='selector' onClick={()=>handleViewSeller(item.email)}> {item.email}</td>
                                          <td >{item.name}</td>
                                          <td>{item.phonenumber}</td>
                                         

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

export default ViewSellers;