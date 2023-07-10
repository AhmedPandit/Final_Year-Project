import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar,Footer, Header} from "../../components";
import { useStateContext } from '../../context/ContextProvider';
import {getuser} from '../../actions/user';
import {getwarehouseforuser,adduserinwarehouse} from "../../actions/warehouse";
import './ConnectWarehouse.css';

import {MDBTable,MDBTableHead,MDBTableBody,MDBTableRow,MDBCol,MDBContainer, MDBRow
    ,MDBBtn,MDBBtnGroup,MDBPagination,MDBPaginationItem,MDBPaginationLink} from 'mdb-react-ui-kit';
import { Button } from '@material-ui/core';
import {setwarehousetoview} from '../../actions/user';

const ConnectWarehouse = () => { 
  const {id}=useParams();
  const dispatch=useDispatch();


  const [activeButton, setActiveButton] = useState(1);
 


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");
  const [value,setValue]=useState("");
  const [sortvalue, setSortValue]=useState("");
  const sortoptions=["OrderID","CustomerName"]

  const [currentpage,setCurrentPage]=useState("");
  const [pagelimit]=useState(4)
  const [warehousedata,setWarehouseData]=useState([])



  const getiddata = async () => {

    const tosend={
        data:id
    }
    const data=await dispatch(getuser(tosend));
    const authdata = JSON.parse(localStorage.getItem('profile'));
    console.log('here')
    console.log(authdata);
    setUserName(authdata.name);
    setUserEmail(authdata.email);
    setUserPic(authdata.image)  
  };

  const handleSearch=()=>{

  }
  const loaduserorders=async(start,end,increase)=>{

  }

  const handleReset=()=>{
    
  }

  const handleSort=()=>{

  }



  const handleView=async (warehouseemail,warehousename,warehouselocation,warehouseimage,
    warehouseaccounthealth,warehousephonenumber,warehousepackagingcharges,warehouseshippingcharges,warehouseid,state,warehousearea,useremail,warehousehandletime)=>{

    await dispatch(setwarehousetoview({warehouseemail,warehousename,warehouselocation,warehouseimage,
      warehouseaccounthealth,warehousephonenumber,warehousepackagingcharges,warehouseshippingcharges,warehouseid,state,warehousearea,warehousehandletime}));
     

      
      console.log(useremail);
      window.location.href=`/ViewFoundWarehouse/${useremail}/${warehouseemail}`
   
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
            <MDBBtn onClick={()=>loaduserorders(4,8,1)}>
                Next
            </MDBBtn>
           </MDBPagination>
        </MDBPagination>
      )
    }
}
  
  const getwarehousedata = async () => {

    
     const warehousedata=await dispatch(getwarehouseforuser(id));
    console.log("here");
    setWarehouseData(warehousedata);
    console.log(warehousedata);
    


    

  };


  useEffect(() => {
      setTimeout(getiddata, 1000)
      setTimeout(getwarehousedata, 1000)
     
    }, [id]);


const {activeMenu}=useStateContext();




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
                 

                                  {warehousedata.length===0 ? (
                                   <div>
                                   <p style={{fontSize:"20px",marginLeft:"30%",marginTop:"15%",fontWeight:"bold",color:"darkgray"}}>
                                       There are no warehouses to add</p>
                                      
                                   
                                       </div>
                                  ):
                                  ( 
                                    
                                   
                  <MDBContainer style={{marginLeft:'10px', marginTop:'10px'}}>
                  <div style={{display:'flex',flexDirection:'row'}}>
                  <Header title='Find Warehouses'/>
                

                  </div>
              
                  
                     <div>
                        <MDBRow>
                          <MDBCol size={12}>
                              <MDBTable>
                                  <MDBTableHead >
                                        <tr style={{fontSize:'15px'}}>
                                          <th scope='col'>Email</th>
                                          <th scope='col'>Name</th>
                                          <th scope='col'>Phone Number</th>
                                          <th scope='col'>Location</th>
                                        
                                        </tr>
                                  </MDBTableHead>
                                  {warehousedata.length===0 ? (
                                    <MDBTableBody className='align-center mb-0'>
                                      <tr>
                                        <td colSpan={8} className='text-center mb-0'>
                                          No Data Found
                                        </td>
                                      </tr>

                                    </MDBTableBody>
                                  ):(
                                    warehousedata.map((item,index)=>(
                                      <MDBTableBody key={index}>

                                        <tr>
                                          <td className='selector' scope='row' onClick={()=>handleView(item.email,item.name,item.location,item.image
                                            ,item.accounthealth,item.phonenumber,item.packagingcharges,item.shippingcharges,item._id,item.state,item.warehousearea,useremail,item.warehousehandletime)} > {item.email}</td>
                                          <td >{item.name}</td>
                                          <td>{item.phonenumber}</td>
                                          <td>{item.location}</td>

                                      
                                        </tr>

                                      </MDBTableBody>
                                    ))
                                  )
                                  }
                              </MDBTable>
                          </MDBCol>
                        </MDBRow>
                      <div style={{marginLeft:'auto',padding:'15px',maxWidth:'400px',alignContent:'center'}}></div>
                    </div>
                     </MDBContainer>
                                  )
                                  }
                         

            
               </div>
          

          </div>
      

     
     

  </div>
)
}
export default ConnectWarehouse