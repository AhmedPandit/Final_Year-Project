import express from "express";
import { signin,signup,getwarehouseuser,getwarehouseforuser,addwarehouseuser,getwarehouserequest,addsellertowarehouse,getsellerinwarehouse
,removesellerfromwarehouse,updateuser,forgotpassword,resetpassword,setresetpassword,getsellerinwarehouserequest,filedisputewarehouse,getdisputeswarehouse,getwarehousepayments,requestpaymentwarehouse} from "../controllers/warehouse.js";

const router =express.Router();

router.post('/signin',signin);
router.post('/signup',signup);
router.post('/getwarehouseuser',getwarehouseuser);
router.post('/addwarehouseuser',addwarehouseuser);
router.post('/forgotpassword',forgotpassword);
router.post('/addsellertowarehouse',addsellertowarehouse);
router.post('/removesellerfromwarehouse',removesellerfromwarehouse);
router.get('/getwarehouseforuser/:values',getwarehouseforuser);
router.get('/getwarehouserequest/:id',getwarehouserequest);
router.get('/getsellerinwarehouse/:sellerid/:warehouseid',getsellerinwarehouse);
router.get('/getsellerinwarehouserequest/:sellerid/:warehouseid',getsellerinwarehouserequest);
router.patch('/updateuser/:id', updateuser);
router.get('/resetpassword/:id/:token',resetpassword);
router.post('/setresetpassword/:id/:token',setresetpassword);
router.post('/filedisputewarehouse',filedisputewarehouse);

router.post('/getdisputeswarehouse',getdisputeswarehouse);

router.post('/getwarehousepayments',getwarehousepayments);
router.post('/requestpaymentwarehouse',requestpaymentwarehouse);

export default router;