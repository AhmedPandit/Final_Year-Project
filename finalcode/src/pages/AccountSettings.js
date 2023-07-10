import {React,useState,useEffect} from "react";
import {useDispatch} from "react-redux";
import { FormButton } from "../components";
import { Textfield } from "../components";
import * as Yup from "yup";
import { Formik,Form } from "formik";
import {Container,Grid,Typography,CardMedia} from "@material-ui/core";
import FileBase from 'react-file-base64';
import {useParams} from "react-router";
import './AccountSettings.css'
import {updateuser} from "../actions/user";
import { useStateContext } from '../context/ContextProvider';
import {Navbar,Sidebar, Header} from "../components";
import { confirm } from "react-confirm-box";
import { locationdata } from "../data/dummy";
import { Select } from "../components";
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/




const FORM_VALIDATION=Yup.object().shape({
    name: Yup.string().min(2, 'Name is Too Short!').max(50, 'Name is Too Long!').required("Name is Required"),
    phonenumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required("Phone number is required"),
    password: Yup.string()
  .required('No password provided.') 
  .min(8, 'Password is too short - should be 8 chars minimum.'),
    image:Yup.string().required("Image is required"),
    location:Yup.string().required("Choose a location"),
  
})


const AccountSettings = () => {

 const authdata = JSON.parse(localStorage.getItem('profile'));  
 console.log(authdata);

 const INITIAL_FORM_STATE={
    name:authdata.name,
    phonenumber:authdata.phonenumber,
    password:"",
    image:"",
    location:authdata.location
   

};



  const { id } = useParams("");;
  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");


  const dispatch=useDispatch();
  
 

  const getiddata = async () => {


    setUserName(authdata.name);
    setUserEmail(authdata.email);
    setUserPic(authdata.image)
  };



  const handleSubmit=async(values,options)=>{

   const result = await confirm("Are you sure?", options);
        if (result) {
          console.log("You click yes!");
          
            const data=await dispatch(updateuser(authdata.email,values));
            console.log(data);
            window.location.href=`/Home/${authdata.email}` 
          return;
        }
        console.log("You click No!");    

    }

    
   

 
   

  useEffect(() => {
      setTimeout(getiddata)
  }, [id]);
  const {activeMenu}=useStateContext();



 


  return (

    <div>
    <div className='flex relative dark:bg-main-dark-bg'>
           
        {activeMenu ? (
            <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
              <  Sidebar email={useremail} />
            </div>
        ):(<div className='w-0 dark:bg-secondary-dark-bg'>
               <Sidebar/>
            </div>
        )}
        <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu? 'md:ml-72' :'flex-2'}`}>
            <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                <Navbar username={username} email={useremail} selectedfile={userpic}/>
   
            </div>


<Grid container style={{marginLeft:'15px',}}>

        <Grid item xs={12} style={{display:'flex',flexDirection:'row'}}>
            <div style={{marginTop:'30px'}}>
            <div>
            <Header title='Account Settings'/>
            </div>
            <p style={{fontSize:"20px",color:'darkgrey',fontWeight:"bold"}}>{useremail}</p>
            </div>
          
  
            <CardMedia className="rounded-full h-24 w-24" style={{height:'200px', width:'200px',marginLeft:"60%",border:"2px solid lightgray"}} image={userpic} />
            
            </Grid>
    

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

                                    <Grid item xs={12}>

                                        <Typography>
                                             Name
                                        </Typography>
                                    </Grid>


                                    <Grid item xs={12}>
                                            <Textfield name="name" 
                                            label="Name"
                                            />
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
                                            {touched.image && errors.image && <div style={{color:'red',marginLeft:"10px"}}>{errors.image}</div>}

                                    <Grid item xs={12}>

                                        <Typography>
                                            Contact Details
                                        </Typography>
                                    </Grid>

                                
                                    <Grid item xs={12}>
                                            <Textfield name="phonenumber" 
                                            label="Phone Number"/>
                                    </Grid>

                                          <Grid item xs={12}>

                                        <Typography>
                                            Password
                                        </Typography>
                                    </Grid>

                                
                                    <Grid item xs={12}>
                                            <Textfield name="password" 
                                            label="Password"/>
                                    </Grid>
                            <Grid item xs={12}>

                                <Typography>
                                    Location
                                </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                <Select name="location"
                                label="Location"
                                options={locationdata}/>
                                </Grid>

                    

                                    <Grid item xs={12}>
                                        <FormButton>
                                                Edit Profile
                                        </FormButton>
                                    </Grid>



                                </Grid>


                            </Form>
                                    )}
                        </Formik>

                </div>

            </Container>

        
</Grid>

      
    </div>

    </div>


</div>



  )

}
export default AccountSettings;