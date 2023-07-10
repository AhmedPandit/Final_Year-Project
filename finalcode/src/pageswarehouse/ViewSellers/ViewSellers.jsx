import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar,Footer, Header} from "../../componentswarehouse";
import { useStateContext } from '../../context/ContextProvider';
import {getwarehouserequest,getwarehouseuser,addsellertowarehouse} from "../../actions/warehouse";
import './ViewSellers.css';
import {MDBTable,MDBTableHead,MDBTableBody,MDBTableRow,MDBCol,MDBContainer, MDBRow
    ,MDBBtn,MDBBtnGroup,MDBPagination,MDBPaginationItem,MDBPaginationLink} from 'mdb-react-ui-kit';
import { Button } from '@material-ui/core';

const ViewSellers = () => { 
  const {id}=useParams();
  const dispatch=useDispatch();


  const [activeButton, setActiveButton] = useState(1);
 


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userphone, setUserPhone] = useState("");
  const [accounthealth, setAccountHealth] = useState("");
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



  const getiddata = async () => {

    console.log("here to get data")

    const tosend={
        data:id
    }
    const data=await dispatch(getwarehouseuser(tosend));
    const authdata = JSON.parse(localStorage.getItem('wareprofile'));


    

    
    setUserName(authdata.name);
    setAccountHealth(authdata.accounthealth);
    setUserEmail(authdata.email);
    setUserPhone(authdata.phone);
    setWarehouserequest(authdata.sellers);
    console.log(authdata.sellers);
  
    

  };


  useEffect(() => {

      setTimeout(getiddata, 1000)

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
                                    <div style={{marginTop:"20%",marginLeft:"25%"}}>
                                      <p style={{fontSize:"30px",color:"darkgray",fontWeight:"bold"}}>
                                        No Seller Are Present In Your Warehouse
                                      </p>
                                    </div>
                                  ):
                                  ( 
                                    
                                   
                  <MDBContainer style={{marginLeft:'10px', marginTop:'10px'}}>
                  <div style={{display:'flex',flexDirection:'row'}}>
                  <Header title='Your Sellers'/>
               

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
                                  {warehouserequest.length===0 ? (
                                    <MDBTableBody className='align-center mb-0'>
                                      <tr>
                                        <td colSpan={8} className='text-center mb-0'>
                                          No Data Found
                                        </td>
                                      </tr>

                                    </MDBTableBody>
                                  ):(
                                    warehouserequest.map((item,index)=>(
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
export default  ViewSellers