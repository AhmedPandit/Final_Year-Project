import {React,useState} from "react";
import {useDispatch} from "react-redux";
import { FormButton } from "../components";
import { Textfield } from "../components";
import * as Yup from "yup";
import { Formik,Form } from "formik";
import {makeStyles} from '@material-ui/core/styles';
import {Container,Grid,Typography,Paper} from "@material-ui/core";
import {adminsignin} from "../actions/auth"
import { ToastContainer, toast } from 'react-toastify';

const useStyles=makeStyles((theme)=>({
    formWrapper:{
        marginTop:theme.spacing(5),
        marginBottom:theme.spacing(8),
    },
}))



const FORM_VALIDATION=Yup.object().shape({
    
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is Required"),



  
})

const INITIAL_FORM_STATE={
  
    email:"",
    password:"",
   

};


const SignIn = () => {
    const dispatch=useDispatch();
   
    const classes= useStyles();
  
    const handleSubmit=async (values)=>{
        console.log(values)

        const data=await dispatch(adminsignin(values));
        if(data==undefined){
            toast.error('Invalid email or password', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        else{
            toast.success('Login Successful !', {
                position: toast.POSITION.TOP_RIGHT
            });
        window.location.href=`/Home/admin/${data.existingUser.email}`
        }
      
    }


  

  return (
    <Paper elevation={3} style={{alignItems:"center", display:"flex",width:"50%",marginLeft:"27%",marginTop:"10%"}}>
    <Grid container>

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
                                             Password
                                        </Typography>
                                    </Grid>


                                   
                                    <Grid item xs={12}>
                                            <Textfield name="password" 
                                            label="password"
                                            type="password" />
                                    </Grid>

                                  

                                 

                                    <Grid item xs={12}>
                                           <FormButton>
                                                Sign In
                                           </FormButton>
                                    </Grid>
                                    <ToastContainer />



                                </Grid>


                            </Form>
                                    )}
                        </Formik>

                </div>

            </Container>
        </Grid>
       

    
    </Grid>
    </Paper>
  )
}

export default SignIn