import Admin from "../models/admin.js";
import jwt, { verify } from "jsonwebtoken";
import User from "../models/seller.js";
import disputewarehouses from "../models/disputewarehouses.js";
import Warehouse from "../models/warehouse.js";
import Seller from "../models/seller.js";
import disputesellers from "../models/disputesellers.js";
import ContactSchema from '../models/contact.js';

export const signin=async(req,res)=>{
    const {email,password}=req.body;
    try {
        console.log("checked"+ email + password)
        const existingUser= await Admin.findOne({email});


        console.log("checked"+existingUser.email)

        if(!existingUser){
            return res.status(404).json({message:"User doesnot exist"});
            
        }

      

        if (password==existingUser.password){
        
            console.log(existingUser.name + existingUser._id + existingUser.email)

        const token =jwt.sign({email:existingUser.email,id:existingUser._id,name:existingUser.name},'test', {expiresIn:"1h"})
     

        res.status(200).json({existingUser,token})
       

        }
        else{
            res.status(400).json({message:"Invalid Credentials"})
        }


    } catch (error) {
        res.status(500).json({message:"Something went wrong "})        
    }

}

export const getuser = async (req,res)=>{
    console.log("here")
    const {data}=req.body;
    try{
       
        console.log(data+'is the email')
        const findUser= await User.find({});
        console.log("here")
        console.log(findUser);
        return res.status(200).json(findUser);

    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}

export const getwarehouse = async (req,res)=>{
    console.log("here")
    const {data}=req.body;
    try{
       
        console.log(data+'is the email')
        const findUser= await Warehouse.find({});
        console.log("here")
        console.log(findUser);
        return res.status(200).json(findUser);

    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}


export const deactivateseller = async (req,res)=>{
    const {id}=req.body
    try {
        console.log(id );

        User.findOneAndUpdate(
            { email: id},
            { accountstanding: 'deactivated' },
            { new: true },
            (err, seller) => {
                if (err) console.error(err);
                console.log(seller);
            }
        );
        res.status(200).json({message:"OK"});
        
    } catch (error) {
        res.status(404).json({message:error.message});
        
    }

}

export const reactivateseller = async (req,res)=>{
    const {id}=req.body

    try {

        User.findOneAndUpdate(
            { email: id },
            { accountstanding: 'activated' },
            { new: true },
            (err, seller) => {
                if (err) console.error(err);
                console.log(seller);
            }
        );
        res.status(200).json({message:"OK"});
        
    } catch (error) {
        res.status(404).json({message:error.message});
        
    }

    
}


export const deactivatewarehouse = async (req,res)=>{
    const {id}=req.body
    try {
        console.log(id );

        Warehouse.findOneAndUpdate(
            { email: id},
            { accountstanding: 'deactivated' },
            { new: true },
            (err, seller) => {
                if (err) console.error(err);
                console.log(seller);
            }
        );
        res.status(200).json({message:"OK"});
        
    } catch (error) {
        res.status(404).json({message:error.message});
        
    }

}

export const reactivatewarehouse = async (req,res)=>{
    const {id}=req.body

    try {

        Warehouse.findOneAndUpdate(
            { email: id },
            { accountstanding: 'activated' },
            { new: true },
            (err, seller) => {
                if (err) console.error(err);
                console.log(seller);
            }
        );
        res.status(200).json({message:"OK"});
        
    } catch (error) {
        res.status(404).json({message:error.message});
        
    }

    
}

export const getdisputeswarehouse= async (req,res)=>{
    console.log("here")
    try{
       
        const findUser= await disputewarehouses.find({});
        console.log(findUser);
        console.log("here in to")
        return res.status(200).json(findUser);

    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}



export const getdisputesseller= async (req,res)=>{
    console.log("here")
    try{
       
        const findUser= await disputesellers.find({});
        console.log(findUser);
        console.log("here in to")
        return res.status(200).json(findUser);

    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}



export const answerwarehousedispute= async (req,res)=>{

    console.log("here")
    const {answer,id}=req.body;
    try{
       
     console.log(answer+ "  sacbsacnsaklcnsa " + id)

     await disputewarehouses.findByIdAndUpdate(
        id,
        {
          response: answer,
          status: "Answered",
        },
        { new: true }
      )
        .then((updatedDispute) => {
          if (updatedDispute) {
            // The dispute was found and updated successfully
            console.log("Updated dispute:", updatedDispute);
            res.status(200).json({message:"OK"});


          } else {
            // The dispute with the given ID was not found
            console.log("Dispute not found.");
          }
        })
        .catch((error) => {
          // An error occurred while updating the dispute
          console.error("Error updating dispute:", error);
        });
    
      
      
      
      
      

    }

    catch(error){
        res.status(404).json({message:error.message});
    }

}


export const answersellerdispute= async (req,res)=>{

    console.log("here")
    const {answer,id}=req.body;
    try{
       
     console.log(answer+ "  sacbsacnsaklcnsa " + id)

     await disputesellers.findByIdAndUpdate(
        id,
        {
          response: answer,
          status: "Answered",
        },
        { new: true }
      )
        .then((updatedDispute) => {
          if (updatedDispute) {
            // The dispute was found and updated successfully
            console.log("Updated dispute:", updatedDispute);
            res.status(200).json({message:"OK"});


          } else {
            // The dispute with the given ID was not found
            console.log("Dispute not found.");
          }
        })
        .catch((error) => {
          // An error occurred while updating the dispute
          console.error("Error updating dispute:", error);
        });
    
      
      
      
      
      

    }

    catch(error){
        res.status(404).json({message:error.message});
    }

}


export const gettotal=async (req,res)=>{
    console.log("here")
   
    try{

        const sellerCount = await Seller.countDocuments();
        const warehouseCount = await Warehouse.countDocuments();
        const disputeSellerCount = await disputesellers.countDocuments({ status: 'InProgress' });
        const disputeWarehouseCount = await disputewarehouses.countDocuments({ status: 'InProgress' });

        const counts = {
            sellers: sellerCount,
            warehouses: warehouseCount,
            unansweredseller:disputeSellerCount,
            unansweredwarehouse:disputeWarehouseCount
          };

          console.log(counts)
       
          res.status(200).json({counts});
       
  
  
  
  
      }
  
      catch(error){
          res.status(404).json({message:error.message});
      }
  }
  
  export const getbuyerqueries=async (req,res)=>{


    console.log("here in buyer quereis")
   
    try{

       const queriesofbuyers=await ContactSchema.find({})
       console.log(queriesofbuyers)
          res.status(200).json({queriesofbuyers});
       
  
  
  
  
      }
  
      catch(error){
          res.status(404).json({message:error.message});
      }


  }