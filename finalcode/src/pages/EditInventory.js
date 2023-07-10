import {React,useState,useEffect} from "react";
import {useParams} from "react-router";
import {Navbar,Sidebar,Footer} from "../components";
import {useDispatch} from "react-redux";
import FileBase from 'react-file-base64';
import { FormButton } from "../components";
import { Textfield } from "../components";
import { Select } from "../components";
import { categorydata } from "../data/dummy";
import * as Yup from "yup";
import { Formik,Form } from "formik";
import {Container,Grid,Typography} from "@material-ui/core";
import { updateproduct } from "../actions/products";
import { getuser } from "../actions/user";
import { useStateContext } from '../context/ContextProvider';
import { confirm } from "react-confirm-box";




const FORM_VALIDATION=Yup.object().shape({
    productname: Yup.string().required("required"),
    productprice: Yup.number().positive().integer().required("required"),
    inventoryspace: Yup.number().positive().integer().required("required"),
    productquantity: Yup.number().positive().integer().required("required"),
    productcategory: Yup.string().required("required"),
    productdescription: Yup.string().required("required"),
    image:Yup.string().required("Image is required"),
    shippingmethod:Yup.string().required("Shipping Method is required"),

  
})




const EditInventory = () => {
    const dispatch=useDispatch();
    const inventoryitem=JSON.parse(localStorage.getItem("inventory"));
    console.log(inventoryitem);
    const { userid,productid } = useParams("");
   
    const INITIAL_FORM_STATE={
        productname:inventoryitem.productname,
        productprice:inventoryitem.productprice,
        inventoryspace:inventoryitem.inventoryspace,
        productquantity:inventoryitem.productquantity,
        productcategory:inventoryitem.productcategory,
        productdescription:inventoryitem.productdescription,
        image:inventoryitem.image,
        shippingmethod:inventoryitem.shippingmethod,
        
    
    
    };
  
  
    // const history = useHistory();
  
    const [username, setUserName] = useState("");
    const [useremail, setUserEmail] = useState("");
    const [userpic, setUserPic] = useState("");
    const [shippingwarehouses,setShippingWarehouses]=useState('');
    const [shippingmethod,setShippingMethod]=useState({
        
    })

  
    // console.log([inddata]);
    const updateShippingMethod = (shippingwarehouses) => {
        setShippingWarehouses(shippingwarehouses);
        const warehouses = [...shippingwarehouses]; // Create a copy of the shipping warehouses array
        const method = { ...shippingmethod }; // Create a copy of the shipping method object
      
        // Loop through the warehouses and add them to the shipping method object
        warehouses.forEach((warehouse, index) => {
          method[`${warehouse.email}`] = warehouse.email; // Use a dynamic key name to add the warehouse name to the shipping method object
        });

        setShippingMethod(method); // Update the shipping method state with the new data
    };

    const getiddata = async () => {
  
      const tosend={
          data:userid
      }
      const authdata = JSON.parse(localStorage.getItem('profile'));
      const data=await dispatch(getuser(tosend));
      console.log('here')
      console.log(productid)
      console.log(authdata);
      setUserName(authdata.name);
    
      setUserEmail(authdata.email);
    
      setUserPic(authdata.image)

      updateShippingMethod(data.warehouses);
 
    };
  
    useEffect(() => {
        setTimeout(getiddata)
    }, [userid]);
  

    const handleSubmit=async(values,options)=>{

        const result = await confirm("Are you sure you want to edit your inventory?", options);
        if (result) {
          console.log("You click yes!");
          
           
        if(inventoryitem.status=="pending"){


            const tosend={...values,productid}
            console.log(tosend);
        
            await dispatch(updateproduct(tosend,useremail));
            window.location.href=`/ViewProduct/${useremail}`;  
     
         }
         else{
 
             const tosend={...values,productid,productquantity:inventoryitem.productquantity}
             await dispatch(updateproduct(tosend,useremail));
             window.location.href=`/ViewProduct/${useremail}`;  
 
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
                                            <FileBase name ="image" type="file" multiple={false} defaultValue={INITIAL_FORM_STATE.image}
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

                            {inventoryitem.status=="pending"?(
                                  <Grid item xs={6}>
                                  <Textfield name="productquantity" 
                                  label="Product Quantity"/>
                          </Grid>
                            ):(
                                ""
                            )}

                          

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
                                    Shipping Method
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Select name="shippingmethod"
                                label="Shipping Method"
                                options={shippingmethod}/>
                            </Grid>

                            {inventoryitem.status=="pending"?(<div style={{width:"100%"}}>

                                     <Grid item xs={12}>

                                
                                <Typography>
                                    Space Your Inventory Will Occupy
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                            <Textfield name="inventoryspace" 
                                    label="Inventory Space"/>
                            </Grid>
                            </div>):("")}

                               
                            


                            <Grid item xs={12}>
                                   <FormButton>
                                        Edit Product
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

      
    </div>

    </div>


</div>
    
  )
                                }


export default EditInventory