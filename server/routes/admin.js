import express from "express";
import {signin,getuser,deactivateseller,reactivateseller,getwarehouse,deactivatewarehouse,reactivatewarehouse,getdisputeswarehouse,answerwarehousedispute,getdisputesseller,answersellerdispute ,gettotal,
getbuyerqueries} from "../controllers/admin.js";


const router =express.Router();

router.post('/signin',signin);
router.post('/getuser',getuser);
router.post('/getwarehouse',getwarehouse);
router.post('/deactivateseller',deactivateseller);
router.post('/reactivateseller',reactivateseller);


router.post('/deactivatewarehouse',deactivatewarehouse);
router.post('/reactivatewarehouse',reactivatewarehouse);

router.post('/getdisputeswarehouse',getdisputeswarehouse);
router.post('/getdisputesseller',getdisputesseller);

router.post('/answerwarehousedispute',answerwarehousedispute);
router.post('/answersellerdispute',answersellerdispute);
router.post('/gettotal',gettotal);
router.post('/getbuyerqueries',getbuyerqueries);


export default router;