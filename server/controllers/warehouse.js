import  bcrypt from "bcryptjs";
import jwt, { verify } from "jsonwebtoken";
import Warehouse from "../models/warehouse.js";
import nodemailer from "nodemailer";
import User from "../models/seller.js";
import chatusers from "../models/users.js"
import disputewarehouses from "../models/disputewarehouses.js";
import paymentswarehouse from "../models/paymentswarehouse.js";
import stripePackage from 'stripe';

export const signin=async(req,res)=>{
    const {email,password}=req.body;
    try {
        console.log("checked");
        const existingUser= await Warehouse.findOne({email});

        console.log("checked"+existingUser.email)

        if(!existingUser){
            return res.status(404).json({message:"User doesnot exist"});
            
        }

        

        const  isPasswordcorrect= await bcrypt.compare(password,existingUser.password);

        if(!isPasswordcorrect) return res.status(400).json({message:"Invalid Credentials"});

        const token =jwt.sign({email:existingUser.email,id:existingUser._id,name:existingUser.name},'test', {expiresIn:"1h"})

        return res.status(200).json({existingUser,token})


    } catch (error) {
        res.status(500).json({message:"Something went wrong "})        
    }

}

export const signup=async(req,res)=>{


   
    const {name,email,phonenumber,password,confirmpassword,image,location}=req.body;
   

    try {

        
        const existingUser= await Warehouse.findOne({email:email});
        const existingUser2= await User.findOne({email:email});
        
        console.log("here")
      
      
     

        if(existingUser || existingUser2){
            return res.status(404).json({message:"User already exists"});
            
    
        }

        
       
        if(password != confirmpassword) return res.status(404).json({message:"Password Donot Match"});

      
       

        const hashedpassword= await bcrypt.hash(password,12);
        const accountstanding="inactive"
       
        

        const result= await Warehouse.create({email,password:hashedpassword,name,phonenumber,image,location,accountstanding})
        const result2= await chatusers.create({email,password:hashedpassword,name,role:"Warehouse"})
        
        
        const token =jwt.sign({email:result.email,id:result._id,name:result.name},'test', {expiresIn:"1h"});
        res.status(200).json({result,token})
        
        
    } catch (error) {
        res.status(500).json({message:"Something went wrong "})    
    }

}

export const getwarehouseuser = async (req,res)=>{
    const {data}=req.body;
    try{
       
        console.log(data+'is the email')
        const findUser= await Warehouse.findOne({email:data});
        console.log(findUser);
        console.log("here");
        return res.status(200).json(findUser);

    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}


export const getwarehouseforuser = async (req,res)=>{

    console.log("here are we")
   
    const {values}=req.params;
    console.log(values);
   
    try{
       
       
        const warehousesWithoutSeller = await Warehouse.find({ 
            'sellers.email': { $ne: values },
            'sellersrequest.email': { $ne: values },
            
        });
        const activeWarehouses = warehousesWithoutSeller.filter(warehouse => warehouse.accountstanding === 'activated');
        console.log(activeWarehouses)
        return res.status(200).json(activeWarehouses);

    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}

export const addwarehouseuser = async (req,res)=>{
    const {warehouseemail,useremail}=req.body;


    try{
     
       const warehouse= await Warehouse.findOne({ email: warehouseemail, "sellersrequest.email": useremail }, { "sellersrequest.$": 1 })
          
        if (!warehouse) {
                
                console.log("here in addwarehouse");
    
                console.log(warehouseemail +"add")
                
                const findUser= await User.findOne({email:useremail});
                const findWarehouse= await Warehouse.findOne({email:warehouseemail});
                
                
                const newSellerRequest = {
                    name: findUser.name,
                    email: findUser.email,
                    phonenumber: findUser.phonenumber,
                    accounthealth: findUser.accounthealth,
                    location:findUser.location
                  };
    
                const WarehouseRequest = {
                    name: findWarehouse.name,
                    email: findWarehouse.email,
                    location:findWarehouse.location,
                    phonenumber: findWarehouse.phonenumber,
                    image:findWarehouse.image,
                    warehousearea:findWarehouse.warehousearea,
                    warehousehandletime:findWarehouse.warehousehandletime,
                    state:findWarehouse.state,
                    packagingcharges:findWarehouse.packagingcharges,
                    shippingcharges:findWarehouse.shippingcharges,
                    status:"pending"
    
                  };
    
    
               
    
                  await Warehouse.updateOne(
                    { email: warehouseemail }, // Replace with the ID of the warehouse document
                    { $push: { sellersrequest: newSellerRequest } })
    
                   await User.updateOne(
                        { email: useremail }, // Replace with the ID of the warehouse document
                        { $push: { warehouses: WarehouseRequest } })
    
    
                 res.status(200).json({message:"warehouse added"});
    
            
            
          
    

          };    

    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}


export const getwarehouserequest=async (req,res)=>{

    console.log("here are we")

    console.log(req.params)
   
    const data=req.params.id;
    console.log(data);
   try {
    const warehouse= await Warehouse.find({ email:data });

  
    return res.status(200).json(warehouse[0]);

    
   } catch (error) {
    res.status(404).json({message:error.message});
    
   }

}


export const addsellertowarehouse=async (req,res)=>{

   const {selleremail,useremail}=req.body
   console.log(selleremail +" " +useremail)
   try {
   

    const warehouse= await Warehouse.findOne({ email:useremail });

    
    console.log("here in add");

    const user= await User.find({ email:selleremail });
    

    const warehouses= user[0].warehouses.find((wh) => wh.email === useremail);

    // update the status of the warehouse to active
    warehouses.status = "active";

    console.log(user[0].warehouses.find((wh) => wh.email === useremail));

    await user[0].save((err) => {
        if (err) {
          console.error(err);
          return;
        }
      }
      )

    console.log("here in sud");

    const sellersinwarehouse=warehouse.sellers;
    const sellersRequestinwarehouse=warehouse.sellersrequest;
    const sellerToMoveinwarehouse = sellersRequestinwarehouse.find((seller) => seller.email === selleremail);
    const sellerIndexinwarehouse = sellersRequestinwarehouse.findIndex((seller) => seller.email === selleremail);
    sellersRequestinwarehouse.splice(sellerIndexinwarehouse, 1);
    sellersinwarehouse.push(sellerToMoveinwarehouse);
    await warehouse.save();

    return res.status(200).json(warehouse);


    
   } catch (error) {
    res.status(404).json({message:error.message});
    
   }

}

export const getsellerinwarehouse=async(req,res)=>{
    const {sellerid,warehouseid}=req.params;

    try {
        const warehouse= await Warehouse.findOne({ email:warehouseid });

        const sellerId = sellerid; // Replace with the ID of the seller you want to query
        const shippingMethodName = warehouseid; // Replace with the name of the shipping method you want to query

        let inventory = 0;
        let orders = 0;

        const data= warehouse.sellers.find(seller => seller.email === sellerid);

        if(data){
        
        await User.aggregate([
          { $match: { email: sellerId } },
          {
            $facet: {
              inventoryCount: [
                { $unwind: "$inventory" },
                { $match: { "inventory.shippingmethod": shippingMethodName } },
                { $count: "count" },
              ],
              orderCount: [
                { $unwind: "$orders" },
                { $match: { "orders.shippingmethod": shippingMethodName } },
                { $count: "count" },
              ],
            },
          },
        ])
          .exec((err, result) => {
            if (err) {
              // Handle the error
              console.error(err);
            } else {
              if (result[0].inventoryCount.length > 0) {
                inventory = result[0].inventoryCount[0].count;
              }
              console.log(`Inventory count for seller ${sellerId} with shipping method ${shippingMethodName}: ${inventory}`);
        
              if (result[0].orderCount.length > 0) {
                orders = result[0].orderCount[0].count;
              }
              console.log(`Order count for seller ${sellerId} with shipping method ${shippingMethodName}: ${orders}`);


           
        
        
     
        
              const toreturn={data,inventory,orders}
      
           
              
              return res.status(200).json(toreturn);
            }
          });
        }
        else{
            return res.status(200).json(undefined);

        }
          
    
        
       
       

     

        
    } catch (error) {
        res.status(404).json({message:error.message});
        
    }
    
}

export const getsellerinwarehouserequest=async(req,res)=>{
    const {sellerid,warehouseid}=req.params;
  

    try {
        const warehouse= await Warehouse.findOne({ email:warehouseid });
        console.log(warehouse);
        const seller = await warehouse.sellersrequest.find(seller => seller.email === sellerid);
        console.log(seller +"to return");
        return res.status(200).json(seller);

        
    } catch (error) {
        res.status(404).json({message:error.message});
        
    }
    
}

export const removesellerfromwarehouse=async(req,res)=>{
    const {sellerid,warehouseid}=req.body;
    console.log("here to remove seller")

    try {
        console.log("here to remove seller")
        const warehouse= await Warehouse.findOne({ email:warehouseid });
        const user= await User.findOne({ email:sellerid });
        
        const warehouseinventory= warehouse.inventory.find((wh) => wh.creator === sellerid);
        const warehouseorders= warehouse.orders.find((wh) => wh.creator === sellerid);
   
        

        if(warehouseinventory==undefined && warehouseorders==undefined){

            console.log("here")

            const sellers=warehouse.sellers;

            const warehousesinuser=user.warehouses;

            const sellerIndex = sellers.findIndex((seller) => seller.email === sellerid);

            const warehouseIndex = warehousesinuser.findIndex((warehouseinuser) => warehouseinuser.email === warehouseid);

            sellers.splice(sellerIndex, 1);
            warehousesinuser.splice(warehouseIndex, 1);

            await warehouse.save();
            await user.save();
            return res.status(200).json({message:"Warehouse Removed from Seller"});


        }
        else{
            res.status(404).json({message:"Inventory and Order of Seller shall be cleared "});
        }
        
    } catch (error) {
        res.status(404).json({message:error.message});
        
    }
    
}

export const updateuser = async (req, res) => {

    

    const { id } = req.params;
    const { name, phonenumber, password, image,location,packagingcharges,shippingcharges,warehousearea,state,warehousehandletime} = req.body;

    console.log(id);


    try {

        console.log(id);

       

        const hashedpassword= await bcrypt.hash(password,12);
       
        const user = await Warehouse.findOne({ email:id })
        console.log(user.email +"is being edited")

        
        user.name=name;
        console.log(user.name);
        user.phonenumber=phonenumber;
        user.password=hashedpassword;
        user.image=image;
        user.location=location;
        user.packagingcharges=packagingcharges;
        user.shippingcharges=shippingcharges;
        user.warehousearea=warehousearea;
        user.state=state;
        user.warehousehandletime=warehousehandletime;
        user.accountstanding="activated"

        const result= await user.save();
        
        const token =jwt.sign({email:result.email,id:result._id,name:result.name},'test', {expiresIn:"1h"});
        console.log('done')
        res.status(200).json({result,token})
        
        
    } catch (error) {
        res.status(500).json({message:"Something went wrong "})    
    }
    
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ah077837@gmail.com",
      pass: "kgfdmsqrshlgvdcv",
      //kgfdmsqrshlgvdcv    pjtitrgcjlrtveyl
    },
  });
  

export const forgotpassword = async (req, res) => {

    const emailhere = req.body;

    try{
        
      
      
        console.log(emailhere.email)
        const finduser= await Warehouse.find({email:emailhere.email});

        if(finduser.length==0) res.status(401).json({status:401,message:"email not sent"})
       

       
      
        const token =jwt.sign({_id:finduser._id},'test', {expiresIn:"300s"});
      
      
        const email=JSON.stringify(emailhere.email)
        

    
        const sendUserToken= await Warehouse.findOneAndUpdate({email:emailhere.email},{verifytoken:token},{new:true});

        console.log(sendUserToken.verifytoken);
        

        if(sendUserToken){
            
      
          
              
            const mail_options = {
                from: "ah077837@gmail.com",
                to: email,
                subject: "Password Recovery Warehouse",
                
                text:`This Link is only valid for 5 mins http://localhost:3000/Resetpassword/warehouse/${finduser.map((user)=>user._id)}/${sendUserToken.verifytoken}`
            }
            
            
            transporter.sendMail(mail_options,(error,info)=>{
            if(error){
                
                console.log("error",error);
                res.status(401).json({status:401,message:"email not sent"})

            }
            else{
                console.log("here");
                console.log("Email sent",info.response)
                res.status(201).json({status:201,message:"Email sent sucessfully"})
            }
        })}


    }
    catch(error){
        res.status(401).json({status:201,message:"Invald user"})

    }


    // try {

    //     const transporter = nodemailer.createTransport({
    //         service: "gmail",
    //         auth: {
    //           user: "ah077837@gmail.com",
    //           pass: "trdhjhqvaevfqcjh",
    //         },
    //       });
        

    //          const mail_configs = {
    //                     from: "ah077837@gmail.com",
    //                     to: email,
    //                     subject: "Password Recovery",
    //                     html: `<!DOCTYPE html>
    //                 <html lang="en" >
    //                 <head>
    //                 <meta charset="UTF-8">
    //                 <title>CodePen - OTP Email Template</title>
                    
    //                 </head>
    //                 <body>
    //                 <!-- partial:index.partial.html -->
    //                 <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    //                 <div style="margin:50px auto;width:70%;padding:20px 0">
    //                     <div style="border-bottom:1px solid #eee">
    //                     <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Koding 101</a>
    //                     </div>
    //                     <p style="font-size:1.1em">Hi,</p>
    //                     <p>Thank you for choosing Koding 101. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    //                     <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    //                     <p style="font-size:0.9em;">Regards,<br />Koding 101</p>
    //                     <hr style="border:none;border-top:1px solid #eee" />
    //                     <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    //                     <p>Koding 101 Inc</p>
    //                     <p>1600 Amphitheatre Parkway</p>
    //                     <p>California</p>
    //                     </div>
    //                 </div>
    //                 </div>
    //                 <!-- partial -->
                    
    //                 </body>
    //                 </html>`,};

    //                 await transporter.sendMail(mail_configs, function (error, info) {
    //                     if (error) {
    //                       console.log(error);
    //                       return reject({ message: `An error has occured` });
    //                     }
    //                     return resolve({ message: "Email sent succesfuly" });
    //                   });

        
    // } catch (error) {
    //     res.status(500).json({message:"Something went wrong "})    
    // }
    
}

export const resetpassword=async (req,res)=>{
   
    const {id,token}=req.params;

    try {
            const validUser= await Warehouse.findOne({_id:id,verifytoken:token});
            
            
            const verifytoken=jwt.verify(token,'test');
           
            
            if(validUser && verifytoken){
                   
                    res.status(201).json({status:201,validUser});
                   
                   
            }
            else{
                res.status(401).json({status:401,message:"User does not exist"});
            }
    } catch (error) {
        res.status(401).json({status:401,message:error});
    }

}
export const setresetpassword=async (req,res)=>{
   
    const {id,token}=req.params;
    const {password,confirmpassword} =req.body

    try {

        const validUser= await Warehouse.findOne({_id:id,verifytoken:token});
        const verifytoken=jwt.verify(token,'test');

        if(validUser && verifytoken){

            if(password != confirmpassword) return res.status(404).json({message:"Password Donot Match"});
            const hashedpassword= await bcrypt.hash(password,12);
            const setnewuserpass=await Warehouse.findByIdAndUpdate({_id:id},{password:hashedpassword})
            setnewuserpass.save();
            res.status(201).json({status:201,setnewuserpass});
    }
    else{
        res.status(401).json({status:401,message:"User does not exist"});
    }

      
            
    } catch (error) {
       res.status(401).json({status:401,message:error});
    }

}

export const filedisputewarehouse=async (req,res)=>{
    
    const values=req.body.values;
   
    
    try{
            console.log(values.selleremail)
            const warehouse=await User.findOne({email:values.disputeagainst})
            console.log(warehouse)

            if(warehouse){

                const newDispute=new disputewarehouses({...values});

                await newDispute.save(function(error,user){
                    if(error){
                        console.log(error.message)
                    }
                });

                res.status(200).json({message:"OK"});


            }
            else{
             
                res.status(200).json({message:"Noseller"});
            }
 
       
    }
    catch(error){
        res.status(409).json({message:error.message});
    }
}

export const getdisputeswarehouse= async (req,res)=>{
    console.log("here")
    const {data}=req.body;
    try{
       
        console.log(data+'is the email')
        const findUser= await disputewarehouses.find({warehouseemail:data});
        console.log("here")
        return res.status(200).json(findUser);

    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}


export const requestpaymentwarehouse=async (req,res)=>{
    
    const values=req.body.values;
    const stripe = stripePackage('sk_test_51N95ZiJ2kOAGJ5hGZxjbstyd98l4wuZYYPRt1SIGh3xcizKoHOo2XEhm1xX2eKKBvEIBAYIvScru2FX8ojphiCLG00h7b4Jci2');
   
    
    try{
        console.log(values.totalbalance+10);
        const amount2=values.totalbalance;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount2, 
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method: 'pm_card_visa', // Test card token
            confirm: true,
          });
          const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate)
          console.log("cajsbcjsa")
          const newpayment=await new paymentswarehouse({...values,date:formattedDate});
        await newpayment.save(function(error,user){
            if(error){
                console.log(error.message)
            }
        });

        const email=values.warehouseemail;
        const updatedUser2 =  await Warehouse.findOne(
            { email },
       
          );

        console.log(amount2  + "  sum" + updatedUser2.withdrawnbalance)
        const newWithdrawnBalance= parseInt(amount2) + parseInt(updatedUser2.withdrawnbalance);
        console.log("withdrawn abacacsa" + newWithdrawnBalance)
        const pending=updatedUser2.pendingbalance-values.totalbalance




        const updatedUser = await  Warehouse.findOneAndUpdate(
            { email },
            { pendingbalance: pending, withdrawnbalance: newWithdrawnBalance },
            { new: true }
          );

    



          console.log("here")

          res.status(200).json({ message: 'OK' });
    }
    catch(error){
        console.error('Error adding balance:', error);
        res.status(500).json({ error: 'Failed to add balance' });
    }
}


export const getwarehousepayments = async (req,res)=>{
    console.log("here")
    const values=req.body.values;
    try{
       
        console.log(values.data+'is the email')
        const findUser= await paymentswarehouse.find({warehouseemail:values.data});
        console.log(findUser)
        console.log("here")
        return res.status(200).json(findUser);

        
     

    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}