import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';

import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import warehouseRoutes from "./routes/warehouse.js";
import orderRoutes from "./routes/orders.js";
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/admin.js';


const app=express();
app.use(cors());
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));

app.use('/orders',orderRoutes);
app.use('/products',productRoutes);
app.use('/user',userRoutes)
app.use('/warehouse',warehouseRoutes)
app.use('/chat',chatRoutes);
app.use('/admin',adminRoutes);

const CONNECTION_URL="mongodb+srv://Ahmedfinal:mongoahmed@cluster0.z4cri4u.mongodb.net/test";
const PORT=process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=> app.listen(PORT,()=>console.log (`server running on ${PORT}`)))
.catch((error)=>console.log(error.message));



