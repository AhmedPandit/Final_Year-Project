import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar,Footer, Header} from "../../componentswarehouse";
import { useStateContext } from '../../context/ContextProvider';
import {getwarehouserequest,getwarehouseuser,addsellertowarehouse} from "../../actions/warehouse";
import './SupplierRequests.css';
import {MDBTable,MDBTableHead,MDBTableBody,MDBTableRow,MDBCol,MDBContainer, MDBRow
    ,MDBBtn,MDBBtnGroup,MDBPagination,MDBPaginationItem,MDBPaginationLink} from 'mdb-react-ui-kit';
import { Button } from '@material-ui/core';

const SupplierRequests = () => { 
  const {id}=useParams();
  const dispatch=useDispatch();


 


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");

  const [userpic, setUserPic] = useState("");

  const [value,setValue]=useState("");
  const [sortvalue, setSortValue]=useState("");
  const sortoptions=["OrderID","CustomerName"]

  const [currentpage,setCurrentPage]=useState("");
  const [pagelimit]=useState(4)
  const [warehouserequest,setWarehouserequest]=useState([])




  const handleSearch=()=>{

  }
  const loaduserorders=async(start,end,increase)=>{

  }

  const handleReset=()=>{
    
  }

  const handleSort=()=>{

  }

  const handleConnect=async (selleremail,useremail)=>{
    console.log(selleremail,useremail);

    window.location.href=`/ViewSeller/warehouse/${selleremail}/${useremail}`; 


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
const handleViewOrder=(value)=>{
  console.log(value)
  window.location.href=`/Orders/ShipOrder/${useremail}/${value}`
}

  
  const getwarehouserequests = async () => {


    console.log("here to get warehouse request")
    const data=await dispatch(getwarehouserequest(id));
    console.log("here");
    setWarehouserequest(data);
    
  };

  const getiddata = async () => {

    const tosend={
        data:id
    }
    const data=await dispatch(getwarehouseuser(tosend));
    const authdata = JSON.parse(localStorage.getItem('wareprofile'));
    console.log('here')
    console.log(data);
    setUserName(authdata.name);
  
    setUserEmail(authdata.email);
   
    setUserPic(authdata.image)
    
    

  };


  useEffect(() => {

      setTimeout(getiddata, 1000)
      setTimeout(getwarehouserequests,1000)
    },[id]);


const {activeMenu}=useStateContext();




 return (
  <div>
          <div className='flex relative dark:bg-main-dark-bg'>
                 
              {activeMenu ? (
                  <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
                    <  Sidebar  email={id} />
                  </div>
              ):(<div className='w-0 dark:bg-secondary-dark-bg'>
                     <Sidebar/>
                  </div>
              )}
              <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu? 'md:ml-72' :'flex-2'}`}>
                  <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                      <Navbar username={username} email={useremail} selectedfile={userpic}/>
                  </div>
                 

                                  {warehouserequest.length===0 ? (
                                    <MDBTableBody className='align-center mb-0'>
                                      <tr>
                                        <td colSpan={8} className='text-center mb-0'>
                                          No Data Found
                                        </td>
                                      </tr>

                                    </MDBTableBody>
                                  ):
                                  ( 
                                    
                                   
                  <MDBContainer style={{marginLeft:'10px', marginTop:'10px'}}>
                  <div style={{display:'flex',flexDirection:'row'}}>
                  <Header title='Seller Requests'/>
                 

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
                                    
                                      
                                        </tr>
                                  </MDBTableHead>
                                  {warehouserequest.sellersrequest.length==0 ? (
                                    <MDBTableBody className='align-center mb-0'>
                                      <tr>
                                        <td colSpan={8} className='text-center mb-0'>
                                          <p style={{marginTop:"10px",fontSize:"20px",fontWeight:"bold",color:"darkgray"}}>No Data Found</p>
                                        </td>
                                      </tr>

                                    </MDBTableBody>
                                  ):(
                                    warehouserequest.sellersrequest.map((item,index)=>(
                                      <MDBTableBody key={index}>

                                        <tr>
                                          <td scope='row' className='selector' onClick={()=>handleConnect(item.email,useremail)}> {item.email}</td>
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
export default  SupplierRequests