import {React,useState} from "react";
import {useDispatch} from "react-redux";
import { FormButton } from ".";
import * as Yup from "yup";
import { Formik,Form } from "formik";
import {makeStyles} from '@material-ui/core/styles';
import {Container,Grid,Typography,Paper} from "@material-ui/core";
import { Textfield } from ".";
import {forgotpassword} from "../actions/user"
import {forgotpasswordwarehouse} from "../actions/warehouse"
import { Signdata } from "../data/dummy";
import { Select } from "../components";
import { ToastContainer, toast } from 'react-toastify';

const useStyles=makeStyles((theme)=>({
    formWrapper:{
        marginTop:theme.spacing(5),
        marginBottom:theme.spacing(8),
    },
}))



const FORM_VALIDATION=Yup.object().shape({
    
    email: Yup.string().email().required("required"),
    ChooseRole:Yup.string().required("Select Your Roles"),

  
})

const INITIAL_FORM_STATE={
  
    email:"",
    ChooseRole:"",
    
   

};


const Forgotpassword = () => {

    const dispatch=useDispatch();
   
    const classes= useStyles();
    const [message,setmessage]=useState(false);
  
  
    const handleSubmit=async (values)=>{

        if(values.ChooseRole=="Seller"){

                const data=await dispatch(forgotpassword(values));
                if(data==201){
                    toast.success('Reset Email sent at your email', {
                        position: toast.POSITION.TOP_RIGHT
                    });
            
                }
                else{
                    toast.error('Email not found', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
        }
       
        else{
            const data=await dispatch(forgotpasswordwarehouse(values));
            if(data==201){
                toast.success('Reset Email sent at your email', {
                    position: toast.POSITION.TOP_RIGHT
                });
        
            }
            else{
                toast.error('Email not found', {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
           
        }
       
     
   
    
    }


  return (
    <Paper elevation={3} style={{alignItems:"center", display:"flex",width:"50%",marginLeft:"27%",marginTop:'80px'}}>

        <Grid item xs={12}>

            <Container maxWidth="md">
                <div className={classes.formWrapper}>

                        <Formik initialValues={{...INITIAL_FORM_STATE}} validationSchema={FORM_VALIDATION}
                        onSubmit={(values)=>handleSubmit(values)}>

                              {({
                                    values,setFieldValue
                                   
                                    })=>(

                            <Form>

                                <Grid container spacing={2}>

                                      <Grid item xs={12}>

                                        <Typography>
                                             Email
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                            <Textfield name="email" 
                                            label="Email"/>
                                    </Grid>
                                    
                                     <Grid item xs={12}>

                                <Typography>
                                     Requesting password assisstance as
                                </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                <Select name="ChooseRole"
                                label="Role"
                                options={Signdata}/>
                                </Grid>

                                    {message? <p>Password reset link succesfuly sent</p>:""}


                                    <Grid item xs={12}>
                                           <FormButton>
                                                Forgot Password
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
    </Paper>
  )
}

export default Forgotpassword