import {React,useState,useEffect} from "react";
import {useParams} from "react-router";
import {Navbar,Sidebar,Footer} from "../componentswarehouse";
import {useDispatch} from "react-redux";
import FileBase from 'react-file-base64';
import { FormButton } from "../componentswarehouse";
import { Textfield } from "../componentswarehouse";
import {Header} from "../components";
import * as Yup from "yup";
import { Formik,Form } from "formik";
import {Container,Grid,Typography,Button} from "@material-ui/core";
import { requestpaymentwarehouse } from "../actions/warehouse";
import { getwarehousepayments } from "../actions/warehouse";
import { ToastContainer, toast } from 'react-toastify';
import { useStateContext } from '../context/ContextProvider';
import { confirm } from "react-confirm-box";
import {MDBTable,MDBTableHead,MDBTableBody,MDBTableRow,MDBCol,MDBContainer, MDBRow
    ,MDBBtn,MDBBtnGroup,MDBPagination,MDBPaginationItem,MDBPaginationLink} from 'mdb-react-ui-kit';






const RequestPayment = () => {

    const authdata = JSON.parse(localStorage.getItem('wareprofile'));
console.log(authdata);
const regex="^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$"

const FORM_VALIDATION=Yup.object().shape({
    warehouseemail: Yup.string().required("required"),
    accountnumber: Yup.string().matches(regex, 'Account number is not valid').required("Account Number is required"),
    accounttitle: Yup.string().required("required"),
    totalbalance:Yup.string().required("required")
  
})

const INITIAL_FORM_STATE={
    warehouseemail:authdata.email,
    accountnumber:"",
    accounttitle:"",
    totalbalance:""
   
};


    const dispatch=useDispatch();
    const [userpayments,setUserPayments]=useState([]);

    const getpaymentdata = async () => {

        const tosend={
            data:authdata.email
        }
        const data=await dispatch(getwarehousepayments(tosend));
        setUserPayments(data);
        console.log(data);
        
    
      };
    
      useEffect(() => {
          setTimeout(getpaymentdata, 1000)
      },[authdata.email]);

    const handleSubmit=async(values,options)=>{


        

           console.log(values)

           const result = await confirm("Are you sure You want to request this payment?", options);

           if (result) {
             console.log("You click yes!");

             if(values.totalbalance>=50){

                if(authdata.pendingbalance>=values.totalbalance){
                    const data=await dispatch(requestpaymentwarehouse(values));

                    console.log(data);


                    if(data.message=="OK"){
    
                        toast.success('Transaction Succesful !', {
                            position: toast.POSITION.TOP_RIGHT
                        });
                
                    window.location.href=`/Home/warehouse/${authdata.email}` 
    
                    }
                    else{
    
                        toast.error('Transaction Could Not be Completed ', {
                            position: toast.POSITION.TOP_RIGHT
                        });
                
    
                    }
                }

                else{

                    toast.error('Balance should be present in your pending balance', {
                        position: toast.POSITION.TOP_RIGHT
                    });

                }


            
                
            }
            else{

                toast.error('Minimum Payment should be 50', {
                    position: toast.POSITION.TOP_RIGHT
                });

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
              <  Sidebar email={authdata.email} />
            </div>
        ):(<div className='w-0 dark:bg-secondary-dark-bg'>
               <Sidebar/>
            </div>
        )}
        <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu? 'md:ml-72' :'flex-2'}`}>
            <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                <Navbar username={authdata.name} email={authdata.email} selectedfile={authdata.userpic}/>
            </div>
<div style={{marginTop:"10px",marginLeft:'20px',paddingBottom:"20px"}}>
<Header title='Payment' />
</div>
{authdata.pendingbalance>0 ? (<Grid container style={{marginBottom:"50px"}}>

<Grid item xs={12}>

    <Container maxWidth="md">
        <div >

        <Formik initialValues={{...INITIAL_FORM_STATE}} validationSchema={FORM_VALIDATION}
                        onSubmit={handleSubmit}>

                              {({
                                    values,
                                    errors,
                                    handleChange,
                                    handleBlur,
                                    touched,
                                    handleSubmit

                                   
                                    })=>(

                    <Form>

                        <Grid container spacing={2}>

                            <Grid item xs={6}>

                                <Typography>
                                    Payment Request By
                                </Typography>
                            </Grid>


                            <Grid item xs={6}>
                                   {authdata.email}
                            </Grid>

                            
                            <Grid item xs={6}>

                                <Typography>
                                    Withdraw Amount
                                </Typography>
                            </Grid>


                            <Grid item xs={6}>
                                    <Textfield name="totalbalance" 
                                    label="Title"/>
                            </Grid>


                                <Grid item xs={6}>

                                <Typography>
                                   Account Title
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                    <Textfield name="accounttitle" 
                                    label="Title"/>
                            </Grid>

                   

                               <Grid item xs={6}>

                                <Typography>
                                    Account Number
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                    <Textfield name="accountnumber" 
                                    label="Account"/>
                            </Grid>
                              

                            
                          
                            <Grid item xs={12}>
                                   <FormButton>
                                        Request Payment
                                   </FormButton>
                            </Grid>

                            <ToastContainer/>



                        </Grid>


                    </Form>
                            )}
                </Formik>

        </div>

    </Container>
</Grid>
</Grid>):("")}


<div style={{marginTop:"10px",marginLeft:'20px',paddingBottom:"20px"}}>

<Header title='Payment Summary' />
<div>
                        <MDBRow>
                          <MDBCol size={12}>
                              <MDBTable>
                                  <MDBTableHead >
                                        <tr style={{fontSize:'15px'}}>
                                          
                                          <th scope='col'>Warehouse Email</th>
                                          <th scope='col'>Account Title</th>
                                          <th scope='col'>Account Number</th>
                                          <th scope='col'>Withdrawn Balance</th>
                                          <th scope='col'>Date</th>
                                         
                            
                                        </tr>
                                  </MDBTableHead>
                                  {userpayments.length===0 ? (
                                    <MDBTableBody className='align-center mb-0'>
                                      <tr>
                                        <td colSpan={8} className='text-center mb-0'>
                                        <p style={{marginTop:"10px",fontSize:"20px",fontWeight:"bold",color:"darkgray"}}>No Data Found</p>
                                        </td>
                                      </tr>

                                    </MDBTableBody>
                                  ):(
                                    userpayments.map((item,index)=>(
                                        <MDBTableBody key={index}>
  
                                          <tr>
                                            <td scope='row' className='selector'> {item.warehouseemail}</td>
                                            <td>{item.accounttitle}</td>
                                            <td >{item.accountnumber}</td>
                                            <td >{item.totalbalance}</td>
                                            <td >{item.date}</td>
                                            
                                           
                                           
  
                                          </tr>
  
                                        </MDBTableBody>
                                    ))
                                  )
                                  }
                              </MDBTable>
                          </MDBCol>
                        </MDBRow>
                     
                    </div>
</div>

  
    </div>
    <ToastContainer/>

    </div>


</div>
    
  )
                                }


export default RequestPayment