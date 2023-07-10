import {React,useState,useEffect} from "react";
import {useParams} from "react-router";
import {Navbar,Sidebar,Footer} from "../../componentswarehouse";
import {useDispatch} from "react-redux";
import FileBase from 'react-file-base64';
import { FormButton } from "../../componentswarehouse";
import { Textfield } from "../../componentswarehouse";
import { Select ,Header} from "../../componentswarehouse";
import { categorydata } from "../../data/dummy";
import * as Yup from "yup";
import { Formik,Form } from "formik";
import {Container,Grid,Typography,Button} from "@material-ui/core";
import { filedisputewarehouse } from "../../actions/warehouse";
import { ToastContainer, toast } from 'react-toastify';
import { useStateContext } from '../../context/ContextProvider';
import { confirm } from "react-confirm-box";




const FileDispute = () => {
    const authdata = JSON.parse(localStorage.getItem('wareprofile'));
console.log(authdata);

const FORM_VALIDATION=Yup.object().shape({
    warehouseemail: Yup.string().required("required"),
    disputeagainst: Yup.string().required("required"),
    disputetitle: Yup.string().required("required"),
    disputedescription: Yup.string().required("required"),
    image:Yup.string().required("Image is required"),
  
})

const INITIAL_FORM_STATE={
    warehouseemail:authdata.email,
    disputeagainst:"",
    disputetitle:"",
    disputedescription:"",
    image:""
   
};


    const dispatch=useDispatch();
    

  
    

    const handleSubmit=async(values,options)=>{

        

           console.log(values)

           const result = await confirm("Are you sure You want to File Dispute against this Seller?", options);
           if (result) {
             console.log("You click yes!");
             
                const data=await dispatch(filedisputewarehouse(values));

                console.log(data);
                if(data.message=="OK"){

                    toast.success('Dispute Filed !', {
                        position: toast.POSITION.TOP_RIGHT
                    });
            
                window.location.href=`/ViewDisputesWarehouse/warehouse/${authdata.email}` 

                }
                else{

                    toast.error('No Seller with this email exists !', {
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
<Header title='File Dispute' />
</div>      
<Grid container>

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
                                    Dipute By
                                </Typography>
                            </Grid>


                            <Grid item xs={6}>
                                   {authdata.email}
                            </Grid>


                                <Grid item xs={6}>

                                <Typography>
                                    Dispute Against (Email)
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                    <Textfield name="disputeagainst" 
                                    label="Dispute Against"/>
                            </Grid>

                   

                               <Grid item xs={6}>

                                <Typography>
                                    Dispute Title
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                    <Textfield name="disputetitle" 
                                    label="Title"/>
                            </Grid>

 

                            <Grid item xs={12}>

                                <Typography>
                                    Dispute Description
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                    <Textfield  name="disputedescription" label="Description"
                                    multiline={true} minRows={6}/>
                            </Grid>

                             <Grid item xs={12}>

                                <Typography>
                                    Choose Image
                                </Typography>
                            </Grid>


                            <Grid item xs={12}>
                                         <div >
                                            <FileBase name ="image" type="file" multiple={false} 
                                             onDone={({ base64 }) => handleChange({ target: { name: 'image', value: base64 } })} />
                                         </div>
                                    </Grid>
                                    {touched.image && errors.image && <div style={{marginLeft:"6px", color:'red'}}>{errors.image}</div>}

                              

                            
                          
                            <Grid item xs={12}>
                                   <FormButton>
                                        File Dispute
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
</Grid>

  
    </div>

    </div>


</div>
    
  )
                                }


export default FileDispute