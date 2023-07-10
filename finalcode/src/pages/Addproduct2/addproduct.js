import {React,useState,useEffect} from "react";
import {useParams} from "react-router";
import {Navbar,Sidebar,Footer} from "../../components";
import {useDispatch} from "react-redux";
import FileBase from 'react-file-base64';
import { FormButton } from "../../components";
import { Textfield } from "../../components";
import { Select ,Header} from "../../components";
import { categorydata } from "../../data/dummy";
import * as Yup from "yup";
import { Formik,Form } from "formik";
import {Container,Grid,Typography,Button} from "@material-ui/core";
import { createProduct } from "../../actions/products";
import { getuser } from "../../actions/user";
import { useStateContext } from '../../context/ContextProvider';
import { confirm } from "react-confirm-box";


const FORM_VALIDATION=Yup.object().shape({
    productname: Yup.string().required("required"),
    productprice: Yup.number().positive().integer().required("required"),
    productquantity: Yup.number().positive().integer().required("required"),
    productcategory: Yup.string().required("required"),
    productdescription: Yup.string().required("required"),
    image:Yup.string().required("Image is required"),
    shippingmethod:Yup.string().required("Shipping Method is required"),
    inventoryspace: Yup.number().positive().integer().required("required"),
   
  
})

const INITIAL_FORM_STATE={
    productname:"",
    productprice:"",
    productquantity:"",
    productcategory:"",
    productdescription:"",
    image:"",
    shippingmethod:"",
    inventoryspace:"",
   
};


const Addproduct = () => {
    const authdata = JSON.parse(localStorage.getItem('profile'));
    const dispatch=useDispatch();
    
    const { id } = useParams("");
  
  
    // const history = useHistory();
  
    const [username, setUserName] = useState("");
    const [useremail, setUserEmail] = useState("");
    const [userpic, setUserPic] = useState("");
    const [shippingwarehouses,setShippingWarehouses]=useState(0);
    const [shippingmethod,setShippingMethod]=useState({
       
    })

    const updateShippingMethod = (shippingwarehouses) => {
        const warehouses = [...shippingwarehouses]; // Create a copy of the shipping warehouses array
        const method = { ...shippingmethod }; // Create a copy of the shipping method object
      
        // Loop through the warehouses and add them to the shipping method object
        warehouses.forEach((warehouse, index) => {
          if(warehouse.status=='pending') {
            console.log(warehouse.status);
          }
          else{
          method[`${warehouse.email}`] = warehouse.email; // Use a dynamic key name to add the warehouse name to the shipping method object
          setShippingWarehouses(shippingwarehouses+1);
          }
        });

        setShippingMethod(method); // Update the shipping method state with the new data
    };

  
    // console.log([inddata]);
  
    const getiddata = async () => {
  
      const tosend={
          data:id
      }
      const data=await dispatch(getuser(tosend));
      setUserName(authdata.name);
      setUserEmail(authdata.email);
      setUserPic(authdata.image)
      updateShippingMethod(data.warehouses);
    
    };
  
    useEffect(() => {
        setTimeout(getiddata)
    }, [id]);
  

    const handleSubmit=async(values,options)=>{

        

           console.log(values)

           const result = await confirm("Are you sure You want to add this product?", options);
           if (result) {
             console.log("You click yes!");
             
                const data=await dispatch(createProduct(values,useremail));
                console.log("done")
                window.location.href=`/ViewProduct/${authdata.email}` 
             return;
           }
           console.log("You click No!");    
   
       }
          
  
    const handleClick=()=>{

        window.location.href=`/FindWarehouses/${useremail}`

    }

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
<div style={{marginTop:"10px",marginLeft:'20px',paddingBottom:"20px"}}>
<Header title='Add Inventory' />
</div>      
{shippingwarehouses==0 ? (
<div>
<p style={{fontSize:"20px",marginLeft:"30%",marginTop:"15%",fontWeight:"bold",color:"darkgray"}}>
    Inventory cannot be added without a warehouse</p>
    <Button variant="contained" style={{marginLeft:"43%",marginTop:"5px",color:'white',backgroundColor:"darkblue"}} onClick={handleClick}>
        Find warehouses
    </Button>

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
                                    Product Name
                                </Typography>
                            </Grid>


                            <Grid item xs={12}>
                                    <Textfield name="productname" 
                                    label="Product Name"/>
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
                                    Inventory Details
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                    <Textfield name="productprice" 
                                    label="Product Price"/>
                            </Grid>

                            <Grid item xs={6}>
                                    <Textfield name="productquantity" 
                                    label="Product Quantity"/>
                            </Grid>

                            <Grid item xs={12}>

                                <Typography>
                                    Choose Category
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Select name="productcategory"
                                label="Category"
                                options={categorydata}/>
                            </Grid>

                            <Grid item xs={12}>

                                <Typography>
                                    Product Description
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                    <Textfield  name="productdescription" label="Description"
                                    multiline={true} minRows={6}/>
                            </Grid>

                               <Grid item xs={12}>

                                <Typography>
                                    Choose Warehouse
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Select name="shippingmethod"
                                label="Shipping Method"
                                options={shippingmethod}
                                />
                            </Grid>

                              <Grid item xs={12}>

                                <Typography>
                                    Add Your Inventory Space
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                    <Textfield  name="inventoryspace" label="Inventory Space"/>
                            </Grid>

                          
                            <Grid item xs={12}>
                                   <FormButton>
                                        Add Product
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

      )}
    </div>

    </div>


</div>
    
  )
                                }


export default Addproduct