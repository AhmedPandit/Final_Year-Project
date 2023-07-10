import express from "express";

import { addorder,cancelorder,shiporder,getorders,getordersadmin,getorder,shiporderfromseller,deliverorder,cancelorderseller,refundorderseller} from "../controllers/order.js";

const router =express.Router();


router.post('/addorder',addorder);
router.patch('/cancelorder',cancelorder);
router.patch('/cancelorderseller',cancelorderseller);
router.patch('/refundorderseller',refundorderseller);
router.patch('/deliverorder',deliverorder);
router.patch('/shiporder',shiporder);
router.post('/getorders',getorders);
router.post('/getordersadmin',getordersadmin);
router.post('/getorder',getorder);
router.post('/shiporderfromseller',shiporderfromseller);

export default router;