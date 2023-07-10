import express from "express";
import { getproducts,addproduct,updateproduct,deleteproduct,setinventory,getproductsadmin} from "../controllers/products.js";
import auth from "../middleware/auth.js";


const router =express.Router();

router.get('/',auth,getproducts);
router.post('/createproducts',auth,addproduct);
router.patch('/updateproduct/:useremail', auth,updateproduct);
router.patch('/setinventory/:values',setinventory);
router.post('/getproductsadmin',getproductsadmin);

router.delete('/deleteproduct/:userid/:productid', auth,deleteproduct);

export default router;