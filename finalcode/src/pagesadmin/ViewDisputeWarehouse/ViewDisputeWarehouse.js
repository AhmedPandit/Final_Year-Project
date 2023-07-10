import "./ViewDispute.css"
import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {Navbar,Sidebar, Header} from "../../componentsadmin";
import { useStateContext } from '../../context/ContextProvider';
import {CardMedia} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import {Container,Grid,Typography,Button} from "@material-ui/core";
import { confirm } from "react-confirm-box";
import {useDispatch} from 'react-redux';
import {answerwarehousedispute} from "../../actions/admin";
import * as Yup from "yup";
import { FormButton } from "../../componentswarehouse";
import { Textfield } from "../../componentswarehouse";
import { Formik,Form } from "formik";

const ViewProduct = () => { 
  const authdata = JSON.parse(localStorage.getItem('adminprofile'));
  const disputedata = JSON.parse(localStorage.getItem('adminwarehousedispute'));
  const dispatch=useDispatch();

  const { id} = useParams("");
 
  const FORM_VALIDATION=Yup.object().shape({
    answer: Yup.string().required("required"),
  
  
})

const INITIAL_FORM_STATE={
    answer:""
};

const handleSubmit=async(values,options)=>{

        

    console.log(values)

    const result = await confirm("Are you sure You want to answer this dispute?", options);
    if (result) {
      console.log("You click yes!");
      console.log(id);
      
         const data=await dispatch(answerwarehousedispute(values,id));
         if(data.message=="OK"){

            toast.success('Dispute Answered !', {
                position: toast.POSITION.TOP_RIGHT
            });
    
             window.location.href=`/DisputeWarehouse/admin/${authdata.email}` 
         }
         else{
            toast.error('Dispute Cannot be answered !', {
                position: toast.POSITION.TOP_RIGHT
            });
    

         }
       
        
      return;
    }
    console.log("You click No!");    

}

  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");
  const [disputeitem,setDisputeItem]=useState({});
  

  // console.log([inddata]);

  const getiddata = async () => {

    console.log(authdata);
    // const data=await dispatch(getuser(tosend));
    setUserName(authdata.name);
    setUserEmail(authdata.email);
    console.log(disputedata);

    Object.values(disputedata).map((dispute) => {

        if(dispute._id==id){
            setDisputeItem(dispute)
        }
  });


  };


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
                     <Sidebar email={useremail} />
                  </div>
              )}
              <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu? 'md:ml-72' :'flex-2'}`}>
                  <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                      <Navbar username={username} email={useremail} selectedfile={userpic}/>
                  </div>
                 
                  <div style={{marginLeft:'10px',marginTop:'20px'}}>
                    

<div className="upperdiv">

    <Header title="Dispute Details"/>


</div>


<ToastContainer/>


<div className="middlediv">
    <div style={{
          color: "rgba(0, 0, 0, 0.886)",
          backgroundColor: "white",
          padding: "7px",
          margin: "5px",
          borderRadius: "10px",
         display:"flex",
         flexDirection:'row',
          width: "95%",
          marginLeft:"20px",
          webkitBoxShadow:"2px 4px 10px 1px rgba(0,0,0,0.47)",
           boxShadow: "2px 4px 10px 1px rgba(201,201,201,0.47)"

    }}>
        <div>

        <p style={{fontWeight:"700",color:'gray',fontSize:"20px"}}> Dispute Summary </p>
        <p style={{fontWeight:"600",color:'gray'}}>Warehouse Email <span style={{fontWeight:"800",color:'black'}}>: {disputeitem.warehouseemail}</span></p>
        <p style={{fontWeight:"600",color:'gray'}}> Dispute Against <span style={{fontWeight:"800",color:'black'}}>: {disputeitem.disputeagainst}</span></p>
        </div>
        <div style={{marginLeft:"15%",marginTop:"2%"}}>
        <p style={{fontWeight:"600",color:'gray'}}>Dispute Status <span style={{fontWeight:"800",color:'black'}}>: {disputeitem.status}</span></p>
       

        </div>
      

     

      

      
        

    </div>

    <div style={{display:"flex",flexDirection:'row'}}>
        <div>
            <p style={{marginLeft:"30px" ,fontSize:"20px", color:"black",marginTop:"20px",fontWeight:"bold"}}>Description</p>
            <p style={{marginLeft:"30px" ,fontSize:"15px", color:"black",marginTop:"20px",width:"500px",wordWrap:"break-word"}}>{disputeitem.disputedescription}</p>

        </div>

    <div >
        <CardMedia style={{height:'400px', width:'400px',marginLeft:"200px",border:"2px solid lightgray",marginTop:"20px"}}  className=" h-24 w-24 " image={disputeitem.image} />

        </div>
    </div>

    {disputeitem.status=="Answered"? (
        <div>
            <p style={{marginLeft:"30px" ,fontSize:"20px", color:"black",marginTop:"20px",fontWeight:"bold"}}>Response</p>
            <p style={{marginLeft:"30px" ,fontSize:"15px", color:"black",marginTop:"20px",paddingBottom:"40px"}}>{disputeitem.response}</p>
        </div>
    ):(<Grid container>

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
        
                                    <Grid item xs={12}>
        
                                        <Typography>
                                            Answer
                                        </Typography>
                                    </Grid>
        
                                    <Grid item xs={12}>
                                            <Textfield  name="answer" label="Description"
                                            multiline={true} minRows={6}/>
                                    </Grid>
        
                                   
                                      
        
                                    
                                  
                                    <Grid item xs={12}>
                                           <FormButton>
                                                Answer Dispute
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
        </Grid>)}

 

</div>








                </div>
            
          </div>

    </div>
    </div>
)
}

export default ViewProduct;