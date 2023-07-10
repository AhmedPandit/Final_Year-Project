import express from "express";
import {getwarehouses,accessChat } from "../controllers/chat.js";


const router =express.Router();

router.get("/getsellerchat/:value",getwarehouses);
router.post("/accessChat",accessChat)
router.get("/fetchChat")




export default router;