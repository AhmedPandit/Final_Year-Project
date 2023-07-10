import {React,useState} from "react";
import {useDispatch} from "react-redux";
import { FormButton } from "../../components";
import { Textfield } from "../../components";
import * as Yup from "yup";
import { Formik,Form } from "formik";
import {makeStyles} from '@material-ui/core/styles';
import {Container,Grid,Typography,Paper} from "@material-ui/core";
import {signin,warehousesignin} from "../../actions/auth"
import { Select } from "../../components";
import { Signdata } from "../../data/dummy";


const useStyles=makeStyles((theme)=>({
    formWrapper:{
        marginTop:theme.spacing(5),
        marginBottom:theme.spacing(8),
    },
}))



const FORM_VALIDATION=Yup.object().shape({
    
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is Required"),
    ChooseRole:Yup.string().required("Select Your Roles"),


  
})

const INITIAL_FORM_STATE={
  
    email:"",
    password:"",
    ChooseRole:"",
   

};


const SignIn = () => {
    const dispatch=useDispatch();
   
    const classes= useStyles();
  
    const handleSubmit=async (values)=>{

     
     if(values.ChooseRole=="Seller"){
        const data=await dispatch(signin(values));
        console.log(data);
        window.location.href=`/Home/${data.existingUser.email}`

     }
     else{

        const data=await dispatch(warehousesignin(values));
        console.log(data);
        window.location.href=`/Home/warehouse/${data.existingUser.email}`
        
     }
    
     
  
      
    }

    const handleForgot=()=>{
        window.location.href=`/Forgotpassword`

    }
  

  return (
    <Paper elevation={3} style={{alignItems:"center", display:"flex",width:"50%",marginLeft:"27%"}}>
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
                                            label="password"/>
                                    </Grid>

                                     <Grid item xs={12}>

                                <Typography>
                                     Signing as 
                                </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                <Select name="ChooseRole"
                                label="Category"
                                options={Signdata}/>
                                </Grid>

                                     <Grid item xs={12} onClick={handleForgot}>

                                        <Typography style={{cursor:"pointer"}}>
                                            Forgot Password ?
                                        </Typography>
                                        </Grid>

                                    <Grid item xs={12}>
                                           <FormButton>
                                                Sign In
                                           </FormButton>
                                    </Grid>



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