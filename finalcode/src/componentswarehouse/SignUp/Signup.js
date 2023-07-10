import {React,useState} from "react";
import {useDispatch} from "react-redux";
import { FormButton } from "../../components";
import { Textfield } from "../../components";
import * as Yup from "yup";
import { Formik,Form } from "formik";
import {makeStyles} from '@material-ui/core/styles';
import {Container,Grid,Typography,Paper} from "@material-ui/core";
import {signup,warehousesignup} from "../../actions/auth"
import FileBase from 'react-file-base64';
import { Select } from "../../components";
import { Signdata } from "../../data/dummy";

const useStyles=makeStyles((theme)=>({
    formWrapper:{
        marginTop:theme.spacing(5),
        marginBottom:theme.spacing(8),
    },
}))
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/




const FORM_VALIDATION=Yup.object().shape({
    name: Yup.string().min(2, 'Name is Too Short!').max(50, 'Name is Too Long!').required("Name is Required"),
    email: Yup.string().email().required("required"),
    phonenumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required("Phone number is required"),
    password: Yup.string()
  .required('No password provided.') 
  .min(8, 'Password is too short - should be 8 chars minimum.')
  .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  
    confirmpassword: Yup.string().required("No password provided"),
    image:Yup.string().required("Image is required"),
    ChooseRole:Yup.string().required("Select Your Roles"),
  
})

const INITIAL_FORM_STATE={
    name:"",
    email:"",
    phonenumber:"",
    password:"",
    confirmpassword:"",
    image:"",
    ChooseRole:"",
   

};


const SignUp = () => {
  const dispatch=useDispatch();
  
  const classes= useStyles();

  const handleSubmit=async(values)=>{

    if(values.ChooseRole=="Seller"){
        const data=await dispatch(signup(values));
        console.log(data);
        window.location.href=`/Home/${data.existingUser.email}`

     }
     else{
        console.log(values)
        const data=await dispatch(warehousesignup(values));
        console.log(data);
        window.location.href=`/Home/warehouse/${data.result.email}`
        
     }
 
    
    
  }

  return (
    <Paper elevation={3} style={{alignItems:"center", display:"flex",width:"50%",marginLeft:"27%"}}>
    <Grid container>

        <Grid item xs={12}>

            <Container maxWidth="md">
                <div className={classes.formWrapper}>

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

                            <Form onSubmit={handleSubmit}>

                                <Grid container spacing={2}>

                                    <Grid item xs={12}>

                                        <Typography>
                                             Name
                                        </Typography>
                                    </Grid>


                                    <Grid item xs={12}>
                                            <Textfield name="name" 
                                            label="name"/>
                                    </Grid>

                                    

                                       <Grid item xs={12}>

                                        <Typography>
                                            Contact Details
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                            <Textfield name="email" 
                                            label="email"/>
                                    </Grid>

                                    <Grid item xs={6}>
                                            <Textfield name="phonenumber" 
                                            label="phonenumber"/>
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
                                             Confirm Password
                                        </Typography>
                                    </Grid>


                                    <Grid item xs={12}>
                                            <Textfield name="confirmpassword" 
                                            label="confirmpassword"/>
                                    </Grid>

                                       <Grid item xs={12}>

                                        <Typography>
                                             Picture
                                        </Typography>
                                    </Grid>


                                    <Grid item xs={12}>
                                         <div >
                                            <FileBase name ="image" type="file" multiple={false} 
                                             onDone={({ base64 }) => handleChange({ target: { name: 'image', value: base64 } })} />
                                         </div>
                                    </Grid>
                                    {touched.image && errors.image && <div>{errors.image}</div>}


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
                            


                                    <Grid item xs={12}>
                                           <FormButton>
                                                Sign Up
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

export default SignUp