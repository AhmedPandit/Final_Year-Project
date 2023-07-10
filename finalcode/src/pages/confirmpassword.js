import {React,useEffect,useState} from "react";
import {useDispatch} from "react-redux";
import { FormButton } from "../components";
import * as Yup from "yup";
import { Formik,Form } from "formik";
import {makeStyles} from '@material-ui/core/styles';
import {Container,Grid,Typography,Paper} from "@material-ui/core";
import { Textfield } from "../components";
import {setresetpassword} from "../actions/user"
import {resetpassword} from "../actions/user"
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';





const useStyles=makeStyles((theme)=>({
    formWrapper:{
        marginTop:theme.spacing(5),
        marginBottom:theme.spacing(8),
    },
}))



const FORM_VALIDATION=Yup.object().shape({
    
    password: Yup.string()
    .required('No password provided.') 
    .min(8, 'Password is too short - should be 8 chars minimum.'),
    
      confirmpassword: Yup.string().required("No password provided"),


  
})

const INITIAL_FORM_STATE={
  
    password:'',
    confirmpassword:''
    
   

};


const Confirmpassword = () => {
    const {id,token}=useParams();
    const [message,setMessage]=useState(false);
    const dispatch=useDispatch();
   
    const classes= useStyles();

    const userValid=async()=>{

       
        const data=await dispatch(resetpassword(id,token));

        if(data.status==201){
            toast.success("Valid User",{
                position: "top-center"
            })
        }
        else{

            toast.error("Invalid User",{
                position: "top-center"
            })

        }

    }
  
   
  
    const handleSubmit=async (values)=>{

        if(values.password==values.confirmpassword){
            const data=await dispatch(setresetpassword(id,token, values));


            if(data.status==201){
                console.log('uservalid')
                toast.success('Password Reset Successfull !', {
                    position: toast.POSITION.TOP_RIGHT
                });
                window.location.href="/auth";
        }
        else{
    
            toast.error('Password cannot be reset', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        }
        else{
            toast.error('Password and Confirm Password should match', {
                position: toast.POSITION.TOP_RIGHT
            });
        }


       
  
     
     
   
    
    }

    useEffect(()=>{
        userValid()
    },[])

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
                                             Password
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                            <Textfield name="password" 
                                            label="Password"
                                            type="password"/>
                                    </Grid>


                                    
                                      <Grid item xs={12}>

                                        <Typography>
                                             Confirm Password
                                        </Typography>
                                    </Grid>

                                   

                                    <Grid item xs={12}>
                                            <Textfield name="confirmpassword" 
                                            label="Confirmpassword"
                                            type="password"/>
                                    </Grid>









                                    <Grid item xs={12}>
                                           <FormButton>
                                                ConfirmPassword
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

export default Confirmpassword;