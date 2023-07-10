import express from "express";
import { signin,signup,getuser,updateuser,forgotpassword,resetpassword,setresetpassword,filedisputeseller,getdisputes,requestpaymentseller,getuserpayments,dummyroute,dummyroutewarehouse} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router =express.Router();

router.post('/signin',signin);
router.post('/signup',signup);
router.post('/getuser',getuser);
router.post('/getuserpayments',getuserpayments);
router.post('/requestpaymentseller',requestpaymentseller);
router.post('/getdisputes',getdisputes);

router.post('/forgotpassword',forgotpassword);
router.post('/filedisputeseller',filedisputeseller);
router.get('/resetpassword/:id/:token',resetpassword);
router.post('/setresetpassword/:id/:token',setresetpassword);
router.patch('/updateuser/:id', auth, updateuser);
router.post('/dummyroute',dummyroute)
router.post('/dummyroutewarehouse',dummyroutewarehouse)


export default router;