import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useSelector} from 'react-redux';
import {GridComponent,ColumnsDirective,ColumnDirective,Sort,Filter,Page,ExcelExport,Toolbar,
PdfExport,Edit,Inject,Search,Selection} from '@syncfusion/ej2-react-grids';
import {inventoryData,inventoryGrid} from "../data/dummy";
import {MDBTable,MDBTableHead,MDBTableBody,MDBTableRow,MDBCol,MDBContainer, MDBRow
  ,MDBBtn,MDBBtnGroup,MDBPagination,MDBPaginationItem,MDBPaginationLink} from 'mdb-react-ui-kit';
import {getdisputesseller} from "../actions/admin"
import { useStateContext } from '../context/ContextProvider';
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar,Footer, Header} from "../componentsadmin";
import { Button } from '@material-ui/core';

const ViewDisputes = () => {

 const authdata = JSON.parse(localStorage.getItem('adminprofile'));
 const dispatch=useDispatch();
 
  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");
  const [activeButton, setActiveButton] = useState(1);
  const [warehouses,setUserWarehouses]=useState([]);
  const [displaywarehose,setDisplayWarehouse]=useState([]); 


  // console.log([inddata]);

  const getiddata = async () => {

    const data=await dispatch(getdisputesseller());
    console.log(data);

    setUserWarehouses(data);

    setUserName(authdata.name);
  
    setUserEmail(authdata.email);
   
    for (let i=0;i<data.length;i++){
        if(data[i].status=="InProgress"){
          setDisplayWarehouse(displaywarehose=>[...displaywarehose,data[i]])
    
        }
        
  
      }
    

  };

  useEffect(() => {
      setTimeout(getiddata, 1000)
  }, [authdata.email]);




  
  const handleSearch=()=>{

  }
  const handleSort=()=>{

  }

  const handleFilter=(buttonId)=>{
  
    setActiveButton(buttonId)

    console.log(activeButton)

  }

  const handleReset=()=>{

  }
  const handleViewWarehouse=(id)=>{
    console.log(id)
    window.location.href=`/ViewDisputeSeller/admin/${id}`

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
  const products=useSelector((state)=>state.products)

  console.log(products);
  const {activeMenu}=useStateContext();

  const [value,setValue]=useState("");
  const [sortvalue, setSortValue]=useState("");
  const sortoptions=["OrderID","CustomerName"]

  const [currentpage,setCurrentPage]=useState("");
  const [pagelimit]=useState(4)



  const getwarehousedata=()=>{
    console.log("here");
    console.log(activeButton)
    setDisplayWarehouse([]);

    if(activeButton==1){
        console.log(warehouses[0].status);
      for (let i=0;i<warehouses.length;i++){
        if(warehouses[i].status=="InProgress"){
          setDisplayWarehouse(displaywarehose=>[...displaywarehose,warehouses[i]])
    
        }
        
  
      }
    }
    else{
      for (let i=0;i<warehouses.length;i++){
        if(warehouses[i].status=="Answered"){
            console.log(warehouses[i])
            setDisplayWarehouse(displaywarehose=>[...displaywarehose,warehouses[i]])
      
          }


        
        
  
      }
    }
  }
  useEffect(() => {
    setTimeout(getwarehousedata, 1000)

}, [activeButton]);




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
                      <Navbar username={username} email={useremail} />
                  </div>
                 
    
                  <MDBContainer style={{marginLeft:'10px', marginTop:'10px'}}>
                   <div style={{display:'flex',flexDirection:'row'}}>
                   <Header title='View Disputes'/>
            

                   </div>
               
                  

                      <MDBCol size={12}>

                          <MDBBtnGroup>
                            <button  className={` ${activeButton === 1 ? "active" : ""}`} onClick={()=>handleFilter(1)}>InProgress </button>
                            <button  className={` ${activeButton === 2 ? "active" : ""}`}   onClick={()=>handleFilter(2)}>Answered </button>
                          
                          </MDBBtnGroup>
                          <hr class="solid"></hr>

                      </MDBCol>

                    
                    <div>
                        <MDBRow>
                          <MDBCol size={12}>
                              <MDBTable>
                                  <MDBTableHead >
                                        <tr style={{fontSize:'15px'}}>
                                          
                                          <th scope='col'>Seller Email</th>
                                          <th scope='col'>Title</th>
                                          <th scope='col'>Dispute Against</th>
                                         
                            
                                        </tr>
                                  </MDBTableHead>
                                  {displaywarehose.length===0 ? (
                                    <MDBTableBody className='align-center mb-0'>
                                      <tr>
                                        <td colSpan={8} className='text-center mb-0'>
                                        <p style={{marginTop:"10px",fontSize:"20px",fontWeight:"bold",color:"darkgray"}}>No Data Found</p>
                                        </td>
                                      </tr>

                                    </MDBTableBody>
                                  ):(
                                   displaywarehose.map((item,index)=>(
                                      <MDBTableBody key={index}>

                                        <tr>
                                          <td scope='row' className='selector' onClick={()=>handleViewWarehouse(item._id)}> {item.selleremail}</td>
                                          <td >{item.disputetitle}</td>
                                          <td>{item.disputeagainst}</td>
                                         

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

export default ViewDisputes;