import  bcrypt from "bcryptjs";
import jwt, { verify } from "jsonwebtoken";
import stripePackage from 'stripe';
import User from "../models/seller.js";
import nodemailer from "nodemailer";
import Warehouse from "../models/warehouse.js";
import chatusers from "../models/users.js";
import disputesellers from "../models/disputesellers.js";
import paymentsseller from "../models/paymentsseller.js";
import OrderDetail from "../models/orders.js"; 


export const getuser = async (req,res)=>{
    console.log("here")
    const {data}=req.body;
    try{
       
        console.log(data+'is the email')
        const findUser= await User.findOne({email:data});
        console.log("here")
        return res.status(200).json(findUser);

    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}

export const getdisputes = async (req,res)=>{
    console.log("here")
    const {data}=req.body;
    try{
       
        console.log(data+'is the email')
        const findUser= await disputesellers.find({selleremail:data});
        console.log("here")
        return res.status(200).json(findUser);

    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}

export const signin=async(req,res)=>{
    const {email,password}=req.body;
    try {
        console.log("checked")
        const existingUser= await User.findOne({email});
        console.log("checked"+existingUser.email)

        if(!existingUser){
            return res.status(404).json({message:"User doesnot exist"});
            
        }

        

        const  isPasswordcorrect= await bcrypt.compare(password,existingUser.password);

        if(!isPasswordcorrect) return res.status(400).json({message:"Invalid Credentials"});

        const token =jwt.sign({email:existingUser.email,id:existingUser._id,name:existingUser.name},'test', {expiresIn:"1h"})

        res.status(200).json({existingUser,token})


    } catch (error) {
        res.status(500).json({message:"Something went wrong "})        
    }

}

export const signup=async(req,res)=>{
   
    const {name,email,phonenumber,password,confirmpassword,image,location}=req.body;

    try {


        const existingUser= await User.findOne({email});

        console.log(existingUser +"scjsabcja");

        const existingUser2= await Warehouse.findOne({email});


        console.log(existingUser2 +"cnncncncn");
     

        if(existingUser || existingUser2){

            console.log("here")
            return res.status(404).json({message:"User already exists"});
            
    

        }

        
       
        if(password != confirmpassword) return res.status(404).json({message:"Password Donot Match"});
      
       

        const hashedpassword= await bcrypt.hash(password,12);
       
        

        const result= await User.create({email,password:hashedpassword,name,phonenumber,image,location})
        const result2= await chatusers.create({email,password:hashedpassword,name,role:"Seller"})

        
        const token =jwt.sign({email:result.email,id:result._id,name:result.name},'test', {expiresIn:"1h"});
        res.status(200).json({result,token})
        
        
    } catch (error) {
        res.status(500).json({message:"Something went wrong "})    
    }

}

export const updateuser = async (req, res) => {

    

    const { id } = req.params;
    const { name, phonenumber, password, image,location} = req.body;

    console.log(id);


    try {

        console.log(id);

       

        const hashedpassword= await bcrypt.hash(password,12);
       
        const user = await User.findOne({ email:id })
        console.log(user.email +"is being edited")

        
        user.name=name;
        console.log(user.name);
        user.phonenumber=phonenumber;
        user.password=hashedpassword;
        user.image=image;
        user.location=location

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
        const finduser= await User.find({email:emailhere.email});
        console.log(finduser)

        if(finduser.length==0) res.status(401).json({status:401,message:"email not sent"})
       
      
        const token =jwt.sign({_id:finduser._id},'test', {expiresIn:"300s"});
      
      
        const email=JSON.stringify(emailhere.email)
    
    
        const sendUserToken= await User.findOneAndUpdate({email:emailhere.email},{verifytoken:token},{new:true});

          
        

        if(sendUserToken){
          
              
            const mail_options = {
                from: "ah077837@gmail.com",
                to: email,
                subject: "Password Recovery",
                
                text:`This Link is only valid for 5 mins http://localhost:3000/Resetpassword/${finduser.map((user)=>user._id)}/${sendUserToken.verifytoken}`
            }
            
            transporter.sendMail(mail_options,(error,info)=>{
            if(error){
                console.log("error",error);
                res.status(401).json({status:401,message:"email not sent"})

            }
            else{
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
            const validUser= await User.findOne({_id:id,verifytoken:token});
            
            
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

        const validUser= await User.findOne({_id:id,verifytoken:token});
        const verifytoken=jwt.verify(token,'test');

        if(validUser && verifytoken){

            if(password != confirmpassword) return res.status(404).json({message:"Password Donot Match"});
            const hashedpassword= await bcrypt.hash(password,12);
            const setnewuserpass=await User.findByIdAndUpdate({_id:id},{password:hashedpassword})
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

export const filedisputeseller=async (req,res)=>{
    
    const values=req.body.values;
   
    
    try{
            console.log(values.selleremail)
            const warehouse=await Warehouse.findOne({email:values.disputeagainst})
            console.log(warehouse)

            if(warehouse){

                const newDispute=new disputesellers({...values});

                await newDispute.save(function(error,user){
                    if(error){
                        console.log(error.message)
                    }
                });

                res.status(200).json({message:"OK"});


            }
            else{
             
                res.status(200).json({message:"Nowarehouse"});
            }
 
       
    }
    catch(error){
        res.status(409).json({message:error.message});
    }
}

export const requestpaymentseller=async (req,res)=>{
    
    const values=req.body.values;
    const stripe = stripePackage('sk_test_51N95ZiJ2kOAGJ5hGZxjbstyd98l4wuZYYPRt1SIGh3xcizKoHOo2XEhm1xX2eKKBvEIBAYIvScru2FX8ojphiCLG00h7b4Jci2');
   
    
    try{

        console.log(values)
        
        console.log(values.totalbalance+10);
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate)
        const amount2=values.totalbalance;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount2, 
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method: 'pm_card_visa', // Test card token
            confirm: true,
          });
          console.log("cajsbcjsa")
          const newpayment=await new paymentsseller({...values,date:formattedDate});
        await newpayment.save(function(error,user){
            if(error){
                console.log(error.message)
            }
        });

        const email=values.selleremail
        const updatedUser2 =  await User.findOne(
            { email },
       
          );

        console.log(amount2  + "  sum" + updatedUser2.withdrawnbalance)
        const newWithdrawnBalance= parseInt(amount2) + parseInt(updatedUser2.withdrawnbalance);
        console.log("withdrawn abacacsa" + newWithdrawnBalance)
        const pending=updatedUser2.pendingbalance-values.totalbalance



     
        const updatedUser = await  User.findOneAndUpdate(
            { email },
            { pendingbalance: pending, withdrawnbalance: newWithdrawnBalance },
            { new: true }
          );

    



          console.log("here")

          res.status(200).json({ message: 'OK' });
    }
    catch(error){
        console.error('Error adding balance:', error);
        res.status(500).json({ message: 'Failed to add balance' });
    }
}


export const getuserpayments = async (req,res)=>{
    console.log("here")
    const values=req.body.values;
    try{
       
        console.log(values.data+'is the email')
        const findUser= await paymentsseller.find({selleremail:values.data});
        console.log(findUser)
        console.log("here")
        return res.status(200).json(findUser);

        
     

    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}



export const dummyroute = async (req, res) => {
    console.log("here");
    const sellerId = "ahmedpandit24@gmail.com";
    const data =[
      {
        "_id": "646fa2b5255025ab59498b6d",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/03665374-74d3-4925-a82f-ad0e770f6b0f_1.d71ae4304bda899e9d6cbcc6d2cdd942.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "Schiff Buffered Vitamin C Dietary Supplement Tablets' formula combines vitamin C with rose hips (a natural form of bioflavonoids) and is buffered in case the acidic nature of vitamin C irritates your stomach. Vitamin C is needed as a coenzyme for many metabolic pathways. Vitamin C is a powerful antioxidant with important roles in connective tissue, bone and skin health, immune function, and cardiovascular health. It is also necessary to convert folic acid into its active form and helps the body absorb iron.|Schiff Buffered Vitamin C Dietary Supplement Tablets: Supports healthy immune function With rose hips ",
        "productname": "Schiff Buffered Vitamin C Dietary Supplement Tablets, 500 mg, 100 count",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b6e",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/19aa88cc-339a-4ddc-8f6d-1dd687a398ac_1.2594c9758f470216b102f2c7969db374.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "The Therall Heat Retaining Back Support is constructed with four-way stretch material for light compression. Material has ceramic fibers that retain heat and slowly reflecting it back into the joint and surrounding tissues. The result is therapeutic heat penetrated deep into the aching joint, muscles and surrounding tissues to provide long-lasting, soothing relief. Support promotes healing by increasing circulation around the tender joint and improves joint mobility to allow for faster return to daily activities. Can be used with Therall Body Warmer Patch (sold separately) for over 12 hours of soothing heat therapy.| Material has ceramic fibers that retain heat Can be used with Therall Body Warmer Patch Constructed with four-way stretch material ",
        "productname": "FLA Therall Heat Retaining Back Support - X-Large",
        "productprice": 58,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b6f",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/006495e5-6daa-42c8-9232-62b993228a3c_1.1af61c0a1da56fc54189c9bcf7184ea3.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "VERA WANG Sunglasses MIELA Crystal 53MM|Brand new authentic VERA WANG Sunglasses in color Crystal. This Sunglasses frame size is 53-20-140. This model is a, Female frame and comes with everything you would receive if you purchased it at a local retail store. Shop with confidence.",
        "productname": "VERA WANG Sunglasses MIELA Crystal 53MM",
        "productprice": 234,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b70",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/d4f6768d-abd3-421f-b6ea-a1d94bcdbd32_1.795c8e6377eb190b35e57d7481e45097.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "|Unda - Muco Coccinum 10 tabsProduct overview:Plex Remedies are condition-specific homeopathic specialties prepared in low dilutions and are recommended for acute and chronic ailments. The product range helps support: the digestive, hormonal, immune, musculoskeletal, nervous, respiratory, skin, oral and vascular systems.Established over half a century ago in Belgium, UNDA is renowned for manufacturing exceptional homeopathic products utilized in supporting immune, lymphatic and endocrine systems. In the production of all homeopathic remedies UNDA uses only pure materials and herbs that are biodynamically grown or wildcrafted. UNDA produces a broad range of homeopathic products in various potencies including: the unique Numbered Compounds, Gemmotherapy macerates, Schessler Tissue Salts, Gammadyn Oligo-Elements, Organotherapy, Plexes, creams and oils, as well as homeopathic compatible dental care.",
        "productname": "Seroyal USA - Muco coccinum 10t",
        "productprice": 55,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b71",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/069cd099-2dfd-48f2-a2aa-7ba2762d2be0_1.bf85264b16d63fe538b1939bf4f6bf23.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "KENSIE Eyeglasses CHARM Teal 47MM|Brand new authentic KENSIE Eyeglasses in color Teal. This Eyeglasses frame size is 47-16-130. This model is a, Female frame and comes with everything you would receive if you purchased it at a local retail store. Shop with confidence.",
        "productname": "KENSIE Eyeglasses CHARM Teal 47MM",
        "productprice": 83,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b72",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/7d5e862a-1f37-4d90-b261-ec64b1836fa4_1.fb83a627be9f4f0065ac40b52fa6927b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "Slippery Stuff Water-based Jelly, 8-oz tube|Easy to use tube with flip-top cap",
        "productname": "Slippery Stuff Water-based Jelly, 8-oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b73",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6a4361c4-d8c9-4693-a24d-0d9a5993dd90_1.3e361bef8e9390da16c45024b42f9d75.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "|Carrera 5032/COV Sunglasses CA5032COV-0ZT8-5218 - Green Frame, Lens Diameter 52mm, Distance Between Lenses 18mm",
        "productname": "Carrera 5032/COV Sunglasses CA5032COV-0ZT8-5218 - Green Frame, Lens Diameter 52mm, Distance",
        "productprice": 64,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b74",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/0efcba08-67c9-4197-96b9-3741254cad0b_1.057ce35469a0965f244f35e4d2a8bd0a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "CARRERA Eyeglasses 8813 0A1A Transparent Matte Blue 55MM|Brand new authentic CARRERA Eyeglasses in color 0A1A Transparent Matte Blue. This Eyeglasses frame size is 55-17-140. This model is a, Male frame and comes with everything you would receive if you purchased it at a local retail store. Shop with confidence.",
        "productname": "CARRERA Eyeglasses 8813 0A1A Transparent Matte Blue 55MM",
        "productprice": 92,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b75",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/a78ad248-da83-48d7-8565-ef7defc02fd4_1.a7489bedfc4499f1cc22edbf35a0310e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "Auralife is a full spectrum multi vitamin. It contains several minerals chelated to amino acids which promote absorption. Auralife contains a complex proprietary blend of digestion, liver toning and antioxidant promoting enzymes, herbs, and amino acids.|Empirical Labs, Auralife 120 caps",
        "productname": "Empirical Labs, Auralife 120 caps",
        "productprice": 90,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b76",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/57443845-0851-4c2b-8ece-9d7571150813_1.e511d7d5dac79c8b9eaf734ee9be2ef1.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "Sigvaris Advance Armsleeve 912AXRG77-PS 20-30 mmHg Advance Arm Sleeve With Gauntlet Plus; Beige; Extra Large and Regular|Sigvaris Advance armsleeves are woven from microfiber polyamide nylon which pulls moisture away from the skin to keep you comfortable year round. It is also very soft. To further protect your skin the fabric is infused with silver ions which are naturally anti-bacterial. What really sets this sleeve apart is the Sensinnov top-band. The Sensinnov band is used on Sigvaris premium thigh highs. Instead of dots or strips of silicone its one smooth sheet making it very skin friendly. Perfect for fragile or sensitive underarm skin. Sensinnov will keep your sleeve in place and wont roll. Sensinnov grip-top standard.Features. Compression - 20-30mmHg. Size - XR. Color - Beige",
        "productname": "Sigvaris Advance Armsleeve 912AXRG77-PS 20-30 mmHg Advance Arm Sleeve With Gauntlet Plus; Beige; Extra Large and Regular",
        "productprice": 75,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b77",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c67a34b8-0c32-474d-96d4-00d7143a841e_1.d77f31ab960255a9603fafe7c12702ba.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "|Features Ergo plus reacher basic hip kit Kit Includes 27&quot; Ergo Plus Reacher Sock Aid with Foam Handles (2) Pair Each Elastic Shoe Laces Black &amp; White 27&quot; Dressing Stick 24&quot; Stainless Steel Shoehorn &amp; Long Handle Bath Sponge Specifications Size: 27 in. - SKU: MDP13948",
        "productname": "Kinsman Enterprises KNE 37001 27 in. Ergo Plus Reacher Basic Hip Kit",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b78",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/8c3e3703-fded-45c2-bea3-30094bb52025_1.6dc745f46d3f484ce422bd09295a8e4f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "|Bandage Co-Flex 4&quot;X5Yds - 4&quot; X 5 Yard - 1 Roll / Each",
        "productname": "Bandage Co-Flex 4\"X5Yds - 4\" X 5 Yard - 1 Roll / Each",
        "productprice": 51,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b79",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f5cf7072-41c0-4c7d-a237-7be3e83d85c7_1.fc9d120b9f019b93295ba2d3e34ca466.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "KILTER Eyeglasses K5003 210 Brown 49MM|Brand new authentic KILTER Eyeglasses in color 210 Brown. This Eyeglasses frame size is 49-15-135. This model is a, Kids frame and comes with everything you would receive if you purchased it at a local retail store. Shop with confidence.",
        "productname": "KILTER Eyeglasses K5003 210 Brown 49MM",
        "productprice": 86,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b7a",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/07676cc3-de05-4246-95bc-e2075d2411d4_1.fbb96bcba0d2561e0623823da3688b26.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "SUPP TRUNK WALKER BLK SM D/S 1EA/CS DRIVE MED, Model CE 1080 S|Drive Medical Supp Trunk Walker Blk Sm, Each - Model CE 1080 S",
        "productname": "Drive Medical Supp Trunk Walker Blk Sm, Each - Model CE 1080 S",
        "productprice": 212,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b7b",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/1e526261-ca37-40b2-a204-b59041065430_1.73ff98d58d6311c5c77eca72a78a00d6.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "VERA WANG Eyeglasses EILONWY Lilac 52MM|Brand new authentic VERA WANG Eyeglasses in color Lilac. This Eyeglasses frame size is 52-00-140. This model is a, Female frame and comes with everything you would receive if you purchased it at a local retail store. Shop with confidence.",
        "productname": "VERA WANG Eyeglasses EILONWY Lilac 52MM",
        "productprice": 301,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b7c",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ed0d8635-4e0d-4dfb-87d2-73c54eac50c1_1.74ff589794a04cc06b57852b5234bb9b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "|Country of Origin: Ecuador - Latin Botanical Name: Alchornea Floribunda - Plant Parts Used: Bark - Take 1 capsule, 3 times daily, with meals. - TerraVita is an exclusive line of premium-quality, natural source products that use only the finest, purest and most potent ingredients found around the world. TerraVita is hallmarked by the highest possible standards of purity, potency, stability and freshness. All of our products are prepared with the high - Iporuru 4:1 - 450 mg (100 capsules, ZIN: 520567): Iporuru 4:1 - 450 mg",
        "productname": "Iporuru 4:1 - 450 mg (100 capsules, ZIN: 520567) - 3-Pack",
        "productprice": 91,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b7d",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6a560cc0-a210-4ba4-b8a2-6afe4691d629_1.90393d2c8f7d7ecbe81376c0f5095625.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Our soft mesh harnesses are conveniently made to slip over the dog's head and attach only once under the belly. There is a leash attachment on the back for walking. They contain a layer of padd- SKU: ZX9MR70-45MDPK",
        "productname": "Skull Crossbones Screen Print Soft Mesh Harness Pink Medium",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b7e",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/20f928db-1cc3-42c2-9e37-4ea08e49a2bf_1.76841d4ff814bc3ec67a57d5165f6b66.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage 62-26 XLCR Happy Meter Screen Printed Dog Pet Hoodie Cream - Size XL|A poly/cotton sleeved hoodie for cold weather days, double stitched in all the right places for comfort and durability!",
        "productname": "Mirage 62-26 XLCR Happy Meter Screen Printed Dog Pet Hoodie Cream - Size XL",
        "productprice": 61,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b7f",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b2968370-7654-42ff-87b6-0d2185821b37_1.1dda5c155b70e4bab807c7562e24b2b1.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|A poly/cotton sleeveless shirt for every day wear, double stitched in all the right places for comfort and durability! Product Summary : New Pet Products/British Flag Heart Screen Print S- SKU: ZX9MR51-137SMBBL",
        "productname": "British Flag Heart Screen Print Shirt Baby Blue Sm - 10",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b80",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ff235753-0ee4-403a-bb7c-393277ef37d2_1.1c0d1d3c285638fb6722093656e5aa8e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Reflective rope leash with stylish loop handle features strong and stylish plastic handle loop for comfort on the hand grip. Designed with our patented rope clip that is outstanding in design. There are reflective stitching throughout the rope that reflects the light for extra safety in darkness. Fitted with black polished, zinc alloy durable metal 360 swivel hook. Easy to snap on any dog collar or harness. Solid and vibrant colors are easy to see at all times. Our reflective rope dog leashes are a popular length 6'(180cm), and a good choice for walking most dogs. This leash works well for basic obedience training of puppies, and young dogs. Shorter traffic or control leads are also available. Features Reflective rope leash with stylish loop Heavy Duty polyester Rope webbing Multi-layer braided for higher tensile strength Reflective threads for safety &amp; visibility at night&lt;/ |Reflective rope leash with stylish loop handle features strong and stylish plastic handle loop for comfort on the hand grip. Designed with our patented rope clip that is outstanding in design. There are reflective stitching throughout the rope that reflects the light for extra safety in darkness. Fitted with black polished, zinc alloy durable metal 360 swivel hook. Easy to snap on any dog collar or harness. Solid and vibrant colors are easy to see at all times. Our reflective rope dog leashes are a popular length 6'(180cm), and a good choice for walking most dogs. This leash works well for basic obedience training of puppies, and young dogs. Shorter traffic or control leads are also available. Features Reflective rope leash with stylish loop Heavy Duty polyester Rope webbing Multi-layer braided for higher tensile strength Reflective threads for safety &amp; visibility at night Easy to click on and take off Durable plastic rope clip to ensure the quality and easy grip Vibrant colors are easy to see at any times Specifications Color: Blue Nylon Harness: DCSN202 Nylon Collars: DCSN002, DCS006 Length: 5/8&quot; x 72&quot; (13mm x 180cm) - SKU: DCPTL584",
        "productname": "Doco DCROPE2072-02L Reflective Rope Leash with Stylish Loop&#44; Blue - Large",
        "productprice": 66,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b81",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/47fb3683-9034-4b7e-a596-7d2c4631d649_1.03c3f0a303f11c8ba2e4bac5a0fe04bc.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage 500-070 TCLGXL Koi Fish Puppy Holdem Sling Tan w/Cheetah Lg/XL|Koi Fish Puppy Holdem Sling Tan w/Cheetah Lg/XL",
        "productname": "Mirage 500-070 TCLGXL Koi Fish Puppy Holdem Sling Tan w/Cheetah Lg/XL",
        "productprice": 72,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b82",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/3545a2b8-ab1a-4ff3-a6af-50a99635e0eb_1.e7db0273ebc072d527520cdf8f4bd5ca.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "mirage pet products feliz navidad screen print pet hoodies, medium, purple|We are a small, family-owned American workshop/factory that produces nearly 100,000 original products - fun pet apparel, strong dog and cat collars, cute pet toys, and more for everyone's favorite family members. Features Feliz Navidad Screen Print Pet Hoodies A poly/cotton sleeved hoodie for cold weather days, double stitched in all the right places for comfort and durability! Specifications Color: Purple Size: Medium - 12 - SKU: MRPP57769",
        "productname": "mirage 62-25-04 mdpr feliz navidad screen print pet hoodie purple m",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b83",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b7172ff0-a785-47c7-a986-f9f074d9f256.43bbe9d4e0690dc133e258de800b7a1b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "The Cool-Air Cot from Gen7Pets combines portable convenience, outdoor durability and pet-friendly comfort. It is ideal for raising your pet off muddy, bug infested, hot or wet surfaces. The Smart Air-Flow mesh provides cool air comfort and prevents pooling water after it rains which reduces the potential for itchy hotspots on pet's fur. The curved, raised back provides support and is ideal for dogs and cats that like to curl up for a nap. Quick snap-together design for storage and travel and has durable double stiching for extra strength. The powder-coated steel frame will not rust which allows the all-weather cot to be left outdoors.| Large Cool-Air Cot: The Cool-Air Cot from Gen7Pets combines portable convenience, outdoor durability, and pet-friendly comfort It is ideal for raising your pet off muddy, bug infested, hot, or wet surfaces The Smart Air-Flow mesh provides cool air comfort and prevents pooling water after it rains which reducest he potential for itchy hotspots on pet's fur The curved, raised back provides support and is ideal for dogs and cats that like to curl up for a nap Quick snap-together design for storage and travel and has durable double stiching for extra strength The powder-coated steel frame will not rust which allows the all weather cot to be left outdoors ",
        "productname": "Gen7Pets Cool-Air Cot Pet Bed, Large, Trailblazer Blue",
        "productprice": 87,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b84",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/9c2e1fc4-cfa8-4d66-9f28-75f36162ff7d.f97ae22a2ef3138d0e1eec589139bc90.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": " Posh pups will love the feel of this Solid Dog Polo in Ultra Violet! Embroidered logo on collar Button at neck for added room High cut stay dry belly 100% cotton Why We Love It: TheSolid Dog Polo by Doggie Design are a lightweight standard polo with logo on collar. Two functioning buttons for added room with tailored sleeves and high cut stay dry belly. Made of 100% cotton. Sure to be a favorite in your closet of pup cloths. Check out the other solid colors and striped designs sold separately. Sizing Information: X-Small: Chest 11&quot; Neck 9&quot;Small:Chest 13&quot; Neck 12&quot;Medium:Chest 16&quot; Neck 13&quot;Large:Chest 21&quot; Neck 16&quot;X-Large:Chest 23&quot; Neck 19&quot;XX-Large:Chest 28&quot; Neck 20&quot;3X-Large:Chest 32&quot; Neck 24&quot; |Posh pups will love the feel of this Solid Dog Polo in Ultra Violet! The Solid Dog Polo by Doggie Design are a lightweight standard polo with logo on collar. Two functioning buttons for added room with tailored sleeves and high cut stay dry belly. Made of 100% cotton. Sure to be a favorite in your closet of pup cloths. Features Solid Dog Polo Embroidered logo on collar Button at neck for added room High cut stay dry belly 100% cotton Specifications Color: Ultra Violet Size: 3XL Chest Size: 32&quot; Neck Size: 24&quot; - SKU: PTRTL27294",
        "productname": "Solid Dog Polo by Doggie Design - Ultra Violet - 3X-Large",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b85",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/97c120f7-6a57-4743-902f-3f40c047e46f_1.d2883b60f668ca61139be2e117ee5c4a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Plain Nylon Dog Collar XS Purple|Made in the USA. High qualtiy webbing made to military standards with heavy duty hardware.",
        "productname": "Plain Nylon Dog Collar XS Purple",
        "productprice": 55,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b86",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c33af9b4-d6cd-4fe5-984b-88dc43fcc91e_1.160245b64a6f071b5e509c1219095e14.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Puffy air mesh step-in harness features lightweight and durable high quality air mesh that provides a comfort fit, total control and style between your dog's chest. Ultra comfort designs using smoother webbing for the comfort of your buddy. Easy on and easy off, durable side release plastic buckle with adjustable tri-glide for custom fits. Heavy-duty stitching for lasting quality and fully welded metal d-o-ring for higher tensile pull force. Solid and vibrant colors are easy to see. Air mesh is breathable and light weight, keep your pet cool and ventilated and super soft and comfortable on dog's skin and fur. All of harnesses are designed to reduce stress, allowing weight to be distributed evenly through the chest and shoulders when your buddy during walks. Features Puffy air mesh step-in harness leash 100% high quality nylon Hi-Density quality air mesh fabric |Puffy air mesh step-in harness features lightweight and durable high quality air mesh that provides a comfort fit, total control and style between your dog's chest. Ultra comfort designs using smoother webbing for the comfort of your buddy. Easy on and easy off, durable side release plastic buckle with adjustable tri-glide for custom fits. Heavy-duty stitching for lasting quality and fully welded metal d-o-ring for higher tensile pull force. Solid and vibrant colors are easy to see. Air mesh is breathable and light weight, keep your pet cool and ventilated and super soft and comfortable on dog's skin and fur. All of harnesses are designed to reduce stress, allowing weight to be distributed evenly through the chest and shoulders when your buddy during walks. Features Puffy air mesh step-in harness leash 100% high quality nylon Hi-Density quality air mesh fabric Breathable air mesh for comfort and soft feel on dog's skin Dual Layered for higher tensile strength with strong back webbing Heavy duty metal accessories Durable plastic buckle on the top for easy on and easy off Puffy padded feel for dog's comfort Vibrant colors are easy to see at any time of the day Specifications Color: Rasperry Pink Puff Mesh Leash: DCA1150, DCA1160, DCA1348 Extra Small: .375 x 13-17&quot; Small: .625 x 18-25&quot; Medium: .75 x 21-30&quot; Large: 1 x 26-39&quot; Extra Large: 1.5 x 30-46&quot; - SKU: DCPTL207",
        "productname": "Doco DCA201-18XL Puffy Air Mesh Step-In Harness Leash&#44; Raspberry Pink - Extra Large",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b87",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f5a02d48-030d-447c-8bb6-6fb0eb689f44.0f68ddfa101c10ff53883471d348e3a1.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Kaytee Squirrel and Critter Blend is a mix of quality grains and seeds designed to attract squirrels, chipmunks and other backyard critters and provides an alternative to help keep them satisfied and away from bird feeders. SKU:ADIB0002DKB3G|Kaytee&reg; Squirrel and Critter Blend is a mix of quality grains and seeds designed to attract squirrels, chipmunks and other backyard critters and provides an alternative to help keep them satisfied and away from bird feeders.20 lbsContains healthful corn, seeds and nutsDesigned to attract squirrels, chipmunks and other backyard crittersProvides an alternative to help keep them satisfied and away from bird feeders.Poly barrier bag.Feeding InstructionsKeep feeders filled with fresh food.Discard old food before refilling and clean feeders regularly to minimize mold and bacteria.This product is only intended for feeding wild birds.Guaranteed AnalysisCrude Protein (min.) 8.0%Crude Fat (min.) 10.0%Crude Fiber (max.) 9.0%Moisture (max.) 12.0%IngredientsCorn, Oil Sunflower, Whole Peanuts, Striped Sunflower, Artificial Apple Flavor.Storage InstructionsReseal package and store in a cool dry place, preferably in a sealed container. This will protect against insect infestation that can naturally occur with any whole grain seed product.",
        "productname": "Kaytee Squirrel and Critter Blend, 20-Pound",
        "productprice": 66,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b88",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/748b8782-fd81-49db-b634-504f53afe58c_1.99cc20e9b3b74634c8e96c2e88c203dd.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Kaytee Forti-Diet Pro Health 100502100 Seed-Based Blend Parakeet Bird Food, 5 lb|KAYTEE Forti-Diet Pro Health is a Seed-Based Blend of Fresh, Palatable Seeds, Grains and Fortified Supplements that provides the essential nutrients your pet needs for a long, healthy life. With DHA OMEGA-3 - Supports Heart, Brain &amp; Visual Functions Rich in Natural Antioxidants - For general health and immune support Probiotics &amp; Prebiotics -Natural ingredients that aid in digestive health Naturally Preserved - For ideal freshness Enhances feathers and coloring. Features: Conversion instructions: When introducing a new food, begin with a mixture of &quot;old and new&quot; food. Gradually increase the amount of new food over a 7 to 10 day period. For best results, discard any uneaten portion and clean food dish before next feeding. Fresh water should be available at all times. The following feeding amounts can be used as a starting point for one bird. Adjust the portions to maintain proper weight and if additional birds are fed ",
        "productname": "Kaytee Forti-Diet Pro Health 100502100 Seed-Based Blend Parakeet Bird Food, 5 lb",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b89",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/49386a9e-6718-420e-9f27-65c68fca05c5_1.be17158137cd0b47a5d7d5d4de50e239.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Peppermint Widget Genuine Leather Dog Collar Red 10Product Summary : New!/Christmas 2017/Holiday Collars/Peppermint Widget Leather Dog Collars@Christmas/Christmas Dog Collars/Peppermint Widget Leather Dog Collars@Collars and Leashes/Widget Collar Collection/Peppermint Widget Leather Dog Collars|Peppermint Widget Genuine Leather Dog Collar Red 10 Product Summary : New!/Christmas 2017/Holiday Collars/Peppermint Widget Leather Dog Collars@Christmas/Christmas Dog Collars/Peppermint Widget Leather Dog Collars@Collars and Leashes/Widget Collar Collection/Peppermint Widget Leather Dog Collars",
        "productname": "Peppermint Widget Genuine Leather Dog Collar Red 10",
        "productprice": 51,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b8a",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/7f02d249-5d2e-4cb4-ae00-32d4fdeefbb2_1.440c4f34a89e6dccd49d3e6667593332.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Bone Shaped American Flag Screen Print Shirts White XXL (18) Product Summary : Dog Shirts/Screen Print Shirts/Bone Shaped American Flag Screen Print Shirts- SKU: ZX9MR51-08-XXLWT",
        "productname": "Bone Shaped American Flag Screen Print Shirts White XXL - 18",
        "productprice": 99,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b8b",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ab534cc8-3562-4320-84e6-a38998de1934_1.2e51dbd31e6023a8439bc9fe51913b6a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage Pet Products 20-Inch Adopt Me Rhinestone Print Shirt for Pets, 3X-Larg...|Adopt Me Rhinestone Shirt Brown XXXL (20)",
        "productname": "Adopt Me Rhinestone Shirt Brown XXXL (20)",
        "productprice": 88,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b8c",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6e6bcfa7-e51b-48c2-bb9c-a52e9ef3888e_1.99cd5dbc1058f93c25b02447560f44ff.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage 622-27 XS-RD Candy Cane Princess Knit Pet Sweater XS Red|Candy Cane Princess Knit Pet Sweater XS Red",
        "productname": "Mirage 622-27 XS-RD Candy Cane Princess Knit Pet Sweater XS Red",
        "productprice": 56,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b8d",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/15a4e0a6-e1e7-4c85-8f01-be336ac40620_1.061c0d736ea04fdb2c23cd9584bb07cd.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "DetailsOriginal Mane 'n Tail ShampooExclusive original formula containing high lathering, cleansing agents fortified with moisturizers and emollients.Our micro-enriched protein formula provides down to the skin cleansing action and conditioning, leaving the hair soft and shiny.Made and distributed in the USA.DirectionsHuman Use:The amount used will vary depending on the volume and length of hair.Apply the original Mane 'n Tail Shampoo.Work through hair with fingertips, rinse thoroughly and follow with an application of conditioner.For animal Use:Pre-wet the coat with clear water to remove excessive, loose dirt.Add a liberal amount of Mane 'n Tail Shampoo into a bucket of water.Apply shampoo solution with a sponge and massage until a rich lather appears.Allow lather to remain on the hair for several minutes.Rinse until water runs clear.Towel dry.For Best Results:After shampooing, an application of conditioner is recommended.Keep out of eyes and mucous membranes.Keep product from freezing.|Mane 'n Tail and Body Shampoo, 32 Ounce (Pack of 3)",
        "productname": "Mane 'n Tail and Body Shampoo, 32 Ounce (Pack of 3)",
        "productprice": 77,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b8e",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ba99eb01-d34a-4e76-8ff6-fe2870091280_1.7ffd7b5e971459a630c2d77dc5a0106d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "This is an awesome leather luggage tag that will set your luggage apart in style. The tag is made of black leather and the design shown is printed on one side with special inks. A card for your address information (included) slips inside and is protected by a clear vinyl window. The tag is approximately 2.75&quot; (7.0 centimeters) x 4.5&quot; (3.8 centimeters) in size. A leather strap is also included.| Pug Dog Pet Leather Luggage ID Tag Suitcase Carry-On: Leather tag is approximately 2.75&quot; (7.0cm) x 4.5&quot; (3.8cm) Design shown is printed on one side of tag Address card is protected behind clear vinyl window Includes leather strap Sold individually ",
        "productname": "Pug Dog Pet Leather Luggage ID Tag Suitcase Carry-On",
        "productprice": 58,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b8f",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/42ac8076-d864-4d67-a75c-7175f382bca8.9a79901cffde5e7d85d99add63bc6f1c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Holly N Jolly Screen Print Soft Mesh Harness Pink Extra Large",
        "productname": "Holly N Jolly Screen Print Soft Mesh Harness Pink Extra Large",
        "productprice": 71,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b90",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c8392111-4204-4337-b4c4-910b4741ff15_1.c5e72cfcc7e40eb1435aea7325cc96da.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Ideal for fetching, tossing and gnawing, this Woven Figure Eight Dog Rope Toy features a strong, densely woven rope in a twisted shape with a plastic reinforcement in the middle to handle even the toughest dogs. Comes in assorted colors. Measures approximately 12.5&quot; long x 4.75&quot; wide at widest point. Comes packaged to a hanging panel.|Being in the dollar merchandise business since its beginning, we know what sells, and we are always adding new and different items to our inventory. We are always looking for new items, and we have recently added pet items and craft supplies to our catalog. We design all of the packaging for our items to ensure that categories of merchandise have cohesive matching packaging, and that they are appealing to the eye. Features Woven Figure Eight Dog Rope Toy, 12 Piece Ideal for fetching, tossing and gnawing, this Woven Figure Eight Dog Rope Toy features a strong, densely woven rope in a twisted shape with a plastic reinforcement in the middle to handle even the toughest dogs Comes in assorted colors - SKU: KOLIM75785",
        "productname": "Woven Figure Eight Dog Rope Toy",
        "productprice": 67,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b91",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/cb209b36-09dd-40b1-8205-f93eafa17891_1.dc3137cdd627295fe8389d2c33618d7e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Features: -Center-to-center: 24''. -Brass construction. -Classic Traditional collection. Material: -Metal. Dimensions: -2.13'' D. Overall Height - Top to Bottom: -3&quot;. Overall Product Weight: -3.55 lbs. Bars Plumbing Antique Barcelona Brass Bronze Chocolate Chrome English Matte Nickel Polished Satin Amber Black Gold Metal White holidays, christmas gift gifts for girls boys|QAL1320 Features Center-to-center: 24'' Brass construction Classic Traditional collection Material: Metal Dimensions 2.13'' D Overall Height - Top to Bottom: 3&quot; Overall Product Weight: 3.55 lbs ",
        "productname": "Alno Inc Classic Traditional 24'' Grab Bar",
        "productprice": 183,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b92",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/21ea2806-148d-44c7-9e38-49b66c02caba_1.c10492650ce5e765cf71473ce460a94d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "These Classical Easel tabletop cardholders come in 5 sizes to fit your needs. Made out of clear acrylic to display your specials, menus, and much more.|Classic Easel Design;",
        "productname": "5W x 1D x 7H Classic Easel Tabetop Card Holder, case of 12",
        "productprice": 110,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b93",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/5f7539eb-5ae7-4123-bd98-dd66076e0c47_1.765e19801104f09f412dd1f821ed79c5.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage 52-76 XXLAQ Stuck Up Pup Rhinestone Dog Shirt Aqua 2XL|Stuck Up Pup Rhinestone Shirts Aqua XXL (18)Country of Origin: &nbsp;USA and/or Imported",
        "productname": "Stuck Up Pup Rhinestone Shirts Aqua XXL (18)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b94",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/73ab7f52-4330-4071-81dd-c52f37127cfb_1.25baf5effbeed86c2bd774d499ff2795.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|We have created an exciting line of dog fashion that is fun and modern with the certainties of comfort, luxury and affordability. We assure you the best in style, design, and quality. We hope you have as much fun and excitement with us as we have. Features Jake Raincoat Sleek raincoat with easy to clean Polyester and D ring Cloth hook and eye closures Cotton lining 50% Polyester, 50% Cotton Specifications Color: Brown Size: Extra Small - SKU: PCHTF718",
        "productname": "Pooch Outfitters PJRC-XS Jake Raincoat&#44; Brown - Extra Small",
        "productprice": 90,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b95",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e791ef3f-c5bf-467c-83ab-e7f3e9691c2a_1.14610643d5b468321745e0802a41b621.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "GENESIS Eyeglasses G5014 604 Burgundy 52MM|Brand new authentic GENESIS Eyeglasses in color 604 Burgundy. This Eyeglasses frame size is 52-17-135. This model is a, Female frame and comes with everything you would receive if you purchased it at a local retail store. Shop with confidence.",
        "productname": "GENESIS Eyeglasses G5014 604 Burgundy 52MM",
        "productprice": 83,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b96",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/38d255b7-4600-4202-a9f0-a8166354f537_1.b58c6afd0d522b75d88fbca2b304f4e7.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Monarch M-initial keychain h-(Pk/2)|Monarch M-Initial Keychain H - Pack of 2 Take a look at our products, where you can browse through our collection of unique gadgets and gifts. Flip through the widest assortment of products and choose the best one for you. Specifications Weight: 0.1 lbs - SKU: ANCRD2182126",
        "productname": "Monarch M-initial keychain h-(Pk/2)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b97",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/fd350870-35f2-42dc-8d05-b4312192e976_1.351344ccacbb3dd1a1d798dc79dbd079.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Beautifully packed for an amazing thinking of you presentation. Gift Basket Includes: Skittles 2.17oz,Froot Roll .75oz, Chex Mex 1.75oz, Reeses 1.5oz, Nature Valley Peanut Bar 1.49oz, Cheez-it 1.5oz, Gushers 0.9oz, KitKat 1.5oz,Chips OHoy 1.4oz, Ritz Bites 1.0oz, Hersheys 1.55oz, Mini Oero 1.0oz, York Pattie .48oz, Trail Mix 1.5oz, Rice Kripsy Treats 1.3oz, Zoo Animal Cookies 1.0oz, GoldFish .75ozStunning package sure to put a smile on the face of the recepient. Packed in a gift box as shown with an 8inch Plush. Finished with a stunning bow!|Beautifully packed for an amazing thinking of you presentation. Gift Basket Includes: Skittles 2.17oz,Fruit Roll .75oz, Chex Mex 1.75oz, Reeses 1.5oz, Nature Valley Peanut Bar 1.49oz, Cheez-it 1.5oz, Gushers 0.9oz, Kit Kat 1.5oz,Chips AHoy 1.4oz, Ritz Bites 1.0oz, Hersheys 1.55oz, Mini Oero 1.0oz, York Pattie .48oz, Trail Mix 1.5oz, Rice Kripsy Treats 1.3oz, Zoo Animal Cookies 1.0oz, GoldFish .75oz. Stunning package sure to put a smile on the face of the recepient. Packed in a gift box as shown with an 8inch Plush. Finished with a stunning bow!",
        "productname": "CakeSupplyShop Item#004BSG Happy 4th Birthday Rainbow Thinking Of You Cookies, Candy & More Care Package Snack Gift Box Bundle Set - Ships FAST!",
        "productprice": 55,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b98",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/5a0d4fb2-cb7f-4885-8ca3-bc55ab3bde2e_1.3506dc56c1a301ee1a93953b546ff7fe.gif?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|",
        "productname": "POLO RED by Ralph Lauren",
        "productprice": 117,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b99",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/db1df7a3-47ce-4eff-9cfd-e646ab7d2f66_1.81040bba6b841f5387d74e5b22500ffc.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Five Leonard Mountain's Gourmet Soups in a gift box. Perfect for any gift giving occasion or to keep in your pantry. The soup is so easy to prepare, just add water and let it cook for about 20 minutes. You can toss in your favorite meat. If you are vegetarian, then this is perfectly seasoned just as it is.|Leonard Mountain Motor Home Survival Kit Gourmet Soup Mixes: Hunky Chunky Veggie Stew, Spuds 'n Chives Potato, Chicken 'n Pasta, 4 Amigos Tortilla Soup, 3 Amigos Enchilada Stew Ready in 20 minutes--just add water Low sodium Low fat ",
        "productname": "Leonard Mountain Motor Home Survival Kit Gourmet Soup Mixes, 6 oz, 5 count",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b9a",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/457c9770-65e2-45a1-b689-6024cf691c4c_1.46137798a8d567c1140d7bee509c9b8b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Dd collar (double d-ring) has two fully welded black color finished d-rings for added security and strength. This 2 d-ring collars design is to alleviate the pressure from the quick release buckle. Allowing this collar to have maximum pull strength. The high quality nylon provides a comfort fit between your dogs neck and collar. Id ring for attaching your pets identification. Feel safe and secure with the collar. Perfect for bigger breed and when you handling a strong dog. Features Double d-ring dog neck collar 100% high quality nylon Higher tensile strength Nylon is resistance to mildew, aging and abrasion Quick &amp; easy release plastic buckle Tri-glide for easy Heavy duty D-Ring for leash and ID tag Vibrant colors are easy to see at all times Specifications Color: Olive Green Nylon Dog Leash: |Dd collar (double d-ring) has two fully welded black color finished d-rings for added security and strength. This 2 d-ring collars design is to alleviate the pressure from the quick release buckle. Allowing this collar to have maximum pull strength. The high quality nylon provides a comfort fit between your dogs neck and collar. Id ring for attaching your pets identification. Feel safe and secure with the collar. Perfect for bigger breed and when you handling a strong dog. Features Double d-ring dog neck collar 100% high quality nylon Higher tensile strength Nylon is resistance to mildew, aging and abrasion Quick &amp; easy release plastic buckle Tri-glide for easy Heavy duty D-Ring for leash and ID tag Vibrant colors are easy to see at all times Specifications Color: Olive Green Nylon Dog Leash: DCS1048, DCS1072, DCS2048, DCS1148, DCS1172 Medium: .75 x 14-20&quot; Large: 1 x 18-27&quot; Extra Large: 1.5 x 20-30&quot; - SKU: DCPTL219",
        "productname": "Doco DCS005-10XL Double D-Ring Dog Neck Collar&#44; Olive Green - Extra Large",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b9b",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/17c3125e-384a-4806-b433-767377af078f_1.fd07109c9dd648f5cd9b66614af0fc85.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "From easy-going, casual get-togethers to sophisticated, elegant eves, we have the decorative touches to make every party memorable. The details make the difference, and we?ve cornered the market on creativity, with decorative accents to create a unique ambiance for any function.|Party Creations Hot/Cold Cups, 9 Oz, Pastel Blue, 8 Ct",
        "productname": "Party Creations Hot/Cold Cups, 9 Oz, Pastel Blue, 8 Ct",
        "productprice": 77,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b9c",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/bd5ef4f1-db0f-4525-b3ad-11c737029642_1.85aec5e045f54740d33759099f2d0666.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Studded Dragon Hoodies Pink XXL (18) Product Summary : Dog Hoodies/Rhinestone Hoodies/Studded Dragon Hoodies- SKU: ZX9MR54-26-XXLPK",
        "productname": "Studded Dragon Hoodies Pink XXL - 18",
        "productprice": 66,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b9d",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/719e92ae-50f4-40ab-8596-ae395e5b89f7_1.7a0e1e5701d4062de618d6909596df37.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Our soft mesh harnesses are conveniently made to slip over the dog's head and attach only once under the belly. There is a leash attachment on the back for walking. They contain a layer of padd- SKU: ZX9MR70-45MDBL",
        "productname": "Skull Crossbones Screen Print Soft Mesh Harness Blue Medium",
        "productprice": 75,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b9e",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/9adb1983-81a5-4b1a-9128-82e36cd65f82.66b53d1c15afdfc2c43fbbe8081e8ae4.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage 52-28 XXLBBL Evil Rhinestone Dog Shirt Baby Blue 2XL|A poly/cotton sleeveless shirt for every day wear, double stitched in all the right places for comfort and durability!",
        "productname": "Mirage 52-28 XXLBBL Evil Rhinestone Dog Shirt Baby Blue 2XL",
        "productprice": 73,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b9f",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/d154ad81-f10b-48ac-ab01-a741b4e30941_1.43978c920b3b51ddf19a631fc0cc7391.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Size: 1&quot; Wall, 2&quot; Base|Orange Standard Size Cupcake Liners - 100 Count - National Cake Supply",
        "productname": "Orange Standard Size Cupcake Liners - 100 Count - National Cake Supply",
        "productprice": 77,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba0",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6c04b829-c0f0-4706-bc6c-d4ea3131776e_1.046a6b667c18fd5174c66ea0179bb1e8.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Personalized Name Denim &amp; Brown Pacifier Clip The ultimate in glamour and glitz! This just makes you smile! Perfect for a little man! Original and affordable, that would make this a perfect baby gift. These Pacifiers are hand decorated in Brooklyn NY espe|Personalized Name Denim Brown Pacifier Clip The ultimate in glamour and glitz! This just makes you smile! Perfect for a little man! Original and affordable, that would make this a perfect baby gift. These Pacifiers are hand decorated in Brooklyn NY especi",
        "productname": "Personalized Name Denim & Brown Pacifier",
        "productprice": 87,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba1",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/598299b3-2f83-4e99-a2af-c35592c78c79.20060d2e4ed1fd2be6e2ea3895b5ed9f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "This closed toe, thigh high hybrid garment maintains more graduated compression throughout the leg than traditional stockings. The Secure line provides containment and compression to manage venous edema, lymphedema, post-surgical edema, and general edema. High modulus in-lay yarns work to maintain a limb profile and minimizes garment fatigue. Features 30-40 mmHg firm compression Maintains more graduated compression compared to traditional stockings Unique sizing system fits regular and full sizes - up to 40-inch thighs Opaque colors conceal skin blemishes discreetly Durable, comfortable, and breathable Indications Ideal for patients with chronic venous insufficiency (CVI) Lymphedema Lipodema Recurrent venous ulcers Deep vein thrombosis (DVT) Superficial phlebitis Post-thrombotic syndrome Severe varicosities Orthostatic hypotension and post-phlebitic syndrome|Sigvaris Secure 553 Women's Closed Toe Thigh Highs w/Silicone Band - 30-40 mmHg",
        "productname": "Sigvaris Secure 553 Women's Closed Toe Thigh Highs w/Silicone Band - 30-40 mmHg",
        "productprice": 105,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba2",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ad051c3f-32cf-437a-a9fa-878d29d255ea_1.1f5772bcf8e05e36e4bce3420b983110.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Birthday Girl Rhinestone Shirt Red XS (8)",
        "productname": "Birthday Girl Rhinestone Shirt Red XS (8)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba3",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/58bb5049-ecbf-48ac-8ed8-aecd5d89bb7e.ec56fdc80f4ced4bfffc4b58dd7af1b7.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": " MFG# ULC-2-DP ULC2DP UPC# 733572049459 |T H Marine Nav Light Storage Clips 1 Pair ULC-2-DPCountry of Origin: &nbsp;USA or Imported",
        "productname": "T H Marine Nav Light Storage Clips 1 Pair ULC-2-DP",
        "productprice": 54,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba4",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/61ae47ff-fb50-48d8-9450-68eac81056c3_1.b481aa066fe3a53e9bc5f43ff17323e2.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Its A Skin-made in the USA using high quality vinyl. Super rich colors with a matte lamination provide a great look and added protection against minor scratches. Leaves no sticky residue behind.|Made in the U.S.A. | 30-day Money back Guarantee | 100% Satisfaction Guaranteed with every order | Extremely Fast Shipping | Highest Quality Skins on the market today",
        "productname": "Skin Decal For Beats By Dr. Dre Beats Pill Plus / Red Pink Chevron",
        "productprice": 61,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba5",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6a565a7a-57c9-4460-93e2-a586911b8f76_1.9119561487ccd81ba934c267b785955c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Size: 6-3/4&quot; x 2-5/8&quot; x 3/4&quot;. Rectangle Box. 2 Piece Set. Retractable. Ballpoint. Writing Instrument. Pocket Clip. Rollerball. Color(s): Black/Gold. Imprint Method: Screen printed or Engraved.- SKU: ARPN461",
        "productname": "Aeropen International PWD-1001 Black Brass Ballpoint and Rollerball Pen with Double Pen Gift Box",
        "productprice": 66,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba6",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/7a975ca3-56e9-428d-9dda-f8e0addafc18_1.fb81c2cc3536b978f88e4bcd1eab5267.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Hydrates all day for younger-looking skin; Almay line smoothing makeup counteracts moisture loss, a key cause of fine lines; Infused with replenishing hydrators and refreshing cucumber; Hydrates all day for younger-looking skin; Almay line smoothing makeup counteracts moisture loss, a key cause of fine lines; Infused with replenishing hydrators and refreshing cucumber|ALMAY LINE SMOOTH LIQ MU (L) (Pack of 1 Only)",
        "productname": "Almay Line Smoothing Makeup SPF 15 160 Naked",
        "productprice": 62,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba7",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c3f5bd77-7443-4041-a92e-74a3ba004ff5.004c0e9c9d44718ab1f7220ae99dd826.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage Pet Products Heart Leather Emerald Dog Collar, 14&quot;|Heart Leather Emerald Green 14",
        "productname": "Heart Leather Emerald Green 14",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba8",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/311b9d63-d245-4d44-8240-0c2537743572_1.5bc2b52f55e56e8fb730edeaf72c2952.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Smart Blonde is the leading manufacturer of License Plates and Signs. We also offer a distinctive variety of Key chains, magnets and other accessories. Each and every product is made of highest quality aluminium which has resistance to weather, heat and corrosion. Our imperishable products are lightweight and portable. We offer an extensive variety of collection which ranges from classic shades to vibrant ones. Features.|Smart Blonde is the leading manufacturer of License Plates and Signs We also offer a distinctive variety of Key chains, magnets and other accessories Each and every product is made of highest quality aluminium which has resistance to weather, heat and corrosion Our imperishable products are lightweight and portable We offer an extensive variety of collection which ranges from classic shades to vibrant ones Features- Yuma Arizona Background Novelty Metal Key Chain- high gloss metal key chain- Made of the highest quality aluminum for a weather resistant finish- It is lightweight durable- Predrilled with hole and includes keyring- Proudly made in the USASpecifications- Size 15 x 3 in - Dimension 15'' H x 3'' W x 005'' D SKU: SMRTB15127",
        "productname": "Smart Blonde KC-8649 1. 5 x 3 inch Yuma Arizona Background Novelty Metal Key Chain",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba9",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4cecdc29-069c-425a-b607-55fb3b42d118_1.4c7a241f1277b62c55c03eb6c8397aca.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|To prepare healthy and tasty food, you need proper kitchenware. Apart from comprising utensils needed to prepare and serve meals, Kitchenware is also required to store dry food, or even left overs. Now maintain your kitchen in an organized manner with the array of kitchenware. Fill your kitchen with the aroma of delicious foods cooked with ease using one of the quality kitchen utensils from us. Features Food Container - Combo 250 Specifications Color: White Material Type: PAPER Dimensions: 12Z - SKU: SSN5578",
        "productname": "PCT D12RBLD Food Container - Combo 250",
        "productprice": 56,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498baa",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/cf8343fd-ea2d-4635-ba32-ea7d3c789c08_1.6a48bce107683cdd3276761661201b30.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Modern Dandelion Design Stationery - 8.5 x 11-60 Letterhead Sheets - Contempary Letterhead (Modern) Fun modern look stationery to use for letters, invitations or any creative idea that comes to mind. Make your letters stand out with this fun letterhead paper. .Stationery measures 8.5 x 11 inches each and have 60 sheets per packCompatible with both Inkjet and Laser printers60# Husky offset paper |Modern Dandelion Design Stationery - 8.5 x 11-60 Letterhead Sheets - Contempary Letterhead (Modern) - B6503",
        "productname": "Modern Dandelion Design Stationery - 8.5 x 11-60 Letterhead Sheets - Contempary Letterhead (Modern) - B6503",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bab",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/5200e982-4bd5-41b7-b957-4063b7332e1e_1.25fb2ffa972b1f45ea85715ddd8f072b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Our soft mesh harnesses are conveniently made to slip over the dog's head and attach only once under the belly.There is a leash attachment on the back for walking.They contain a layer of padding on the chest for extra comfort while walking.Product Summary : Holiday Pet Products/Christmas and Hannukah/Holiday Harnesses/Presents Screen Print Soft Mesh Harness|Our soft mesh harnesses are conveniently made to slip over the dog's head and attach only once under the belly.There is a leash attachment on the back for walking.They contain a layer of padding on the chest for extra comfort while walking. Product Summary : Holiday Pet Products/Christmas and Hannukah/Holiday Harnesses/Presents Screen Print Soft Mesh Harness",
        "productname": "Presents Screen Print Soft Mesh Harness Blue Extra Large",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bac",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/48dfdeed-465c-43fa-80ae-746a93e17675_1.f07d613a26588a2da4de8a0eb246338e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Country of Origin: Ecuador - Latin Botanical Name: Citrus Aurantifolia - Plant Parts Used: Fruit - Apply Bianca Rosa salve morning and evenings, or as directed by a healthcare practitioner. On a moist cotton wool pad or with the fingertips, apply to the desired area of the body. Massage onto thoroughly cleansed skin with a gentle circular motion. - TerraVita is an exclusive line of premium-quality, natural source products that use only the finest, p - Lime Fruit 4:1 Salve (2 oz, ZIN: 520711): Lime Fruit 4:1 Salve",
        "productname": "Lime Fruit 4:1 Salve (2 oz, ZIN: 520711)",
        "productprice": 60,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bad",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f00259fa-cdab-400e-b427-641bb4b12038_1.58dee2b2bcf176b5c13d865154f047bd.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Discover the secret to a complete eye look in one easy sweep with studio secrets professional the one sweep eye shadow. The unique applicator is designed to fit your eye shape to define, color and highlight your eyes in one easy sweep. The beautifully coordinated shadows come in natural, playful or smoky palettes expertly designed to enhance your eye color. Discover your stunning eye look!|The one sweep shadow is a breakthrough new way for anyone to get a professional eye shadow look. The unique applicator is shaped to fit the eye and apply three shades in one step to define, color and highlight. It's fast, easy, and mistake-proof.",
        "productname": "**DISCONTINUED**L'Oreal Studio Secrets Professional One Sweep Eye Shadow",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bae",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e1f9a34b-ce2e-4de0-b544-ca20315b7ff2.a8fb8a83c50388a5274a20ef1c88fe7a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Snowflake Rhinestone Shirt Aqua M (12) Product Summary : Dog Shirts/Rhinestone Shirts/Snowflake Rhinestone Shirt- SKU: ZX9MR52-25-13-MDAQ",
        "productname": "Snowflake Rhinestone Shirt Aqua M - 12",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498baf",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/45c3c668-9884-4b52-aa70-def3cd6b8563_1.7f45b8eb28166981f44c3fa9981a63d7.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "With a velvety, non-sticky texture Boasts a water-resistant formula that ensures long wearing Offers reflecting pearl colors that revives lipstick color Adds an iridescent shimmer to lips Contains Jojoba Oil to nourish &amp; soften lips Blended with natural antioxidant Vitamin E to lessen skin damage &amp; aging Features a Soft Touch Gliding Applicator that gives a quick application Can be worn alone or over your favorite lip color| With a velvety non-sticky texture. Boasts a water-resistant formula that ensures long wearing. Offers reflecting pearl colors that revives lipstick color. Adds an iridescent shimmer to lips. Contains Jojoba Oil to nourish &amp; soften lips. Blended with natural antioxidant Vitamin E to lessen skin damage &amp; aging. Features a Soft Touch Gliding Applicator that gives a quick application. Can be worn alone or over your favorite lip color. ",
        "productname": "Too Faced Sparkling Glomour Gloss - Pink Bling 3.8ml/0.128oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb0",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b4f16078-6dfc-4b15-9fa6-0cf5f2e9213e_1.9f2c3fe7da88f0591ff83ce5d77fe10e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|A gentle oriental floral with notes of frangipani, apricot, honeysuckle, orchid, lotus, sandalwood, vanilla, and musk. Created in 2009.",
        "productname": "Siren Eau-de-parfume Spray Women by Paris Hilton, 1 Ounce",
        "productprice": 68,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb1",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ad5800f1-e83f-49fd-ae8e-3162b6d61c14_1.8e86edfed1748338ad267180cad7d294.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Sony 357/303 - SR44W/SR44SW Silver Oxide Button Battery 1.55V - 100 Pack + 30% Off Sony 357/303 - SR44W/SR44SW Silver Oxide Button Battery 1.55V *100 Batteries* This battery is used in the following items: Watches, computer motherboards, calculators, PDAs, electronic organizers, garage door openers, toys, games, door chimes, pet collars, LED lights, sporting goods, pedometers, calorie counters, stopwatches and medical devices. Cross Reference: SR44, 157, 103, A76, G13, L1154, LR1154, 357, 303, GP76, SR1154 SR44SW, SR44W Product Eligible for FREE SHIPPING! Free Shipping Offer Applicable for items shipped to US Addresses ONLY|Sony 357/303 - SR44W/SR44SW Silver Oxide Button Battery 1.55V - 100 Pack + 30% Off!",
        "productname": "Sony 357/303 - SR44W/SR44SW Silver Oxide Button Battery 1.55V - 100 Pack + 30% Off!",
        "productprice": 199,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb2",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e1d09d9a-8fd0-4ffd-aec1-70e91b57c821_1.7cfa36de6cd241a67426708728c4078f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Features: -Frame of bend-resistant, powder-coated, 18 ga. cold-formed steel. -Legs are made of high impact polypropylene plastic. -Cover is made of the extremely durable fabric Texron; a non-sag, open weave, vinyl covered polyester yarn. -Lace-up cover can be tightened periodically if necessary. -Cots are stackable. -No screws, nuts or other small parts. Bed Material: -Polyester. Elevated: -Yes. Country of Manufacture: -United States. Dimensions: Overall Height - Top to Bottom: -5&quot;. Size Extra Large - 52&quot; L x 22&quot; W - Overall Depth - Front to Back: -52&quot;. Size Extra Large - 52&quot; L x 22&quot; W - Overall Width - Side to Side: -22&quot;. Size Extra Large - 52&quot; L x 22&quot; W - Overall Product Weight: -8 lbs. Size Extra Long - 52&quot; L x 30&quot; W - Overall Width - Side to Side: -30&quot;. Size Large - 40&quot; L x 30&quot; W - Overall Depth - Front to Back: -40&quot;. Size Large - 40&quot; L x 30&quot; W - Overall Product Weight: -7 lbs. Size Small - 30&quot; L x 22&quot; W - Overall Product Weight: -6 lbs. Size Small - 30&quot; L x 22&quot; W|ZF1280 Features Frame of bend-resistant, powder-coated, 18 ga. cold-formed steel Legs are made of high impact polypropylene plastic Cover is made of the extremely durable fabric Texron; a non-sag, open weave, vinyl covered polyester yarn Lace-up cover can be tightened periodically if necessary Cots are stackable No screws, nuts or other small parts Bed Material: Polyester Elevated: Yes Country of Manufacture: United States Dimensions Overall Height - Top to Bottom: 5&quot; Size Extra Large - 52&quot; L x 22&quot; W Overall Depth - Front to Back: 52&quot; Overall Width - Side to Side: 22&quot; Overall Product Weight: 8 lbs Size Extra Long - 52&quot; L x 30&quot; W Overall Width - Side to Side: 30&quot; Size Large - 40&quot; L x 30&quot; W Overall Depth - Front to Back: 40&quot; Overall Product Weight: 7 lbs Size Small - 30&quot; L x 22&quot; W Overall Product Weight: 6 lbs Overall Depth - Front to Back: 30&quot; ",
        "productname": "4Legs4Pets by Mahar Pet Cot",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb3",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ab896844-c842-4c40-bf56-51b9dbbf035d_1.9c7cbf4cf243201b215aa21c8debf635.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Knot Perfumed Perfumed Body Lotion 6.7oz",
        "productname": "Knot Perfumed Perfumed Body Lotion 6.7oz",
        "productprice": 51,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb4",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c6673c12-058c-429e-b1ae-32640b993829_1.cf7601b1fbe7af055bfdcb9376979a44.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|A poly/cotton sleeveless shirt for every day wear, double stitched in all the right places for comfort and durability! Product Summary : New Pet Products/Red Swiss Dot Paw Screen Print Sh- SKU: ZX9MR51-107SMGY",
        "productname": "Red Swiss Dot Paw Screen Print Shirt Grey Sm - 10",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb5",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/fe9a71ea-a869-4751-abef-fec01c670a25.49aa841052e0bcd95aa0938a4c8ec180.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "The TSP650 series is the fast, entry-level printer that's capable of producing high quality receipts due to the use of the very latest, leading edge components.| High performance, entry-level receipt printer capable of printing at a nonhesitating 150mm per second with an outstanding data throughput High quality 203 dpi print quality with barcode capability including 2D for receipts, coupons and ticketing etc Highly versatile printer with small compact footprint and choice of two paper widths 58mm or 80mm as well as the Star &quot;drop-in and print&quot;, easyload feature ",
        "productname": "Star TSP 654 - label printer - two-color (monochrome) - direct thermal",
        "productprice": 345,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb6",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/fb2781a4-2589-4a85-b5f4-6435e3f08043_1.63dcf58888d8b6c550289fb9a0510ebd.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Take 20-30 drops of extract in a small amount of warm water 3-4 times daily as needed. - Coltsfoot &amp; Wormwood Glycerite Liquid Extract (1:5) - Strawberry Flavored (1 oz, ZIN: 522313): Coltsfoot &amp; Wormwood Glycerite Liquid Extract (1:5) - Strawberry Flavored",
        "productname": "Coltsfoot & Wormwood Glycerite Liquid Extract (1:5) - Strawberry Flavored (1 oz, ZIN: 522313) - 3-Pack",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb7",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b8500019-fa39-452e-8a24-aed50ce51490_1.510046e75fe8c06ed75e9ab89c88b3b7.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Elements Faux Fur Jacket For DogsSuper-soft, luxurious faux fur is lined with shiny satin in Elements Mixed Faux Fur Jackets, for a look that beautifully combines style with warmth.In this elegant Elements Faux Fur Jacket pairing, the jacket's back and front are made of clipped fur, while the sleeves and hood offer high-pile soft plush, for a stunning look that's as functional as it is fashionable.Hood is trimmed with a soft, hairy yarn to complete the lookAdjustable velcro chest closureHigh-cut, stay-dry bellyMaterial: 100% polyester Exported By Code Builders, LLC|Elements Warm Faux Fur Stylish Jacket For Dogs Available In Rose Or Tan Almond (Large Pink Rose)",
        "productname": "Elements Warm Faux Fur Stylish Jacket For Dogs Available In Rose Or Tan Almond (Large Pink Rose)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb8",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e943ca4b-a54e-4202-95ea-eb22e2ee1cf1_1.9aa7526a203389de593246b5be1f4e4b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Yellow Dog Design, Inc., is a dye sublimation/heat transfer printing company specializing in the design and manufacture of a unique line of pet collars and leads, as well as Equine fashions, in their local NC facility. This line is passionate about the product as evidenced by the 5 awesome canines that come to work with us everyday, 4 Labs, and 1 Dachshund. They are our models and some of the best product testers in the industry. Alpine Extra Large Step-In Harness. This Harness can be sized from 28-Inch to 36-Inch. The Step-In Harnesses are made in the U.S.A of 100-percent vibrant color-fast polyester with durable plastic slip locks and metal D-rings. Size: Extra Large. Pattern: Alpine.- SKU: YLDG111",
        "productname": "Yellow Dog Design H-ALP104XL Alpine Roman H Harness - Extra Large",
        "productprice": 67,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb9",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/fed53f8f-1845-4d54-a174-2335171e98b9_1.205ed7b487ef41a4b805ec895257fe9d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Boscoli Olive Salad Italian Oil, 32 OZ (Pack of 6)|Family. www.Boscoli.com.",
        "productname": "Boscoli Olive Salad Italian Oil, 32 OZ (Pack of 6)",
        "productprice": 64,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bba",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f312c9cf-0f8d-434a-8518-3b6ff24c7879.ae1cf98d9244923d00f365986cccd6fe.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage Pet Products Plain Leather Yellow Dog Collar, 14&quot;|Plain Leather Collars Yellow 14",
        "productname": "Plain Leather Collars Yellow 14",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bbb",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/3f547cc2-991c-45a9-8a9f-9b33571923e0_1.b1bf48353992625e302b5d1e481c46ec.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|It's made from nylon. Reasonable structure, sub-grid storage. It is waterproof, Wearable, practical. Has large capacity, can hold a lot of things. Easy to clean waterproof lining and pockets. Fits all the bathroom and shower essentials. Stablity:solid shape,stand steady,and hanging. Waterproof:outer and inner. Features Reasonable structure, sub-grid storage Creative Multifunction Wash Bag Portable Travel Pouch Cosmetic Bag Has large capacity, can hold a lot of things Specifications Color: Dark Blue Size: 11.8 x 3.3 x 7.3&quot; - SKU: PND992",
        "productname": "Panda Superstore PS-SPO7702515011-SUSAN00280 Creative Multifunction Wash Bag Portable Travel Pouch Cosmetic Bag&#44; Dark Blue",
        "productprice": 99,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bbc",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/af456349-f196-4e4a-8e67-d86d112f9781_1.5c26e17fb76cfb7bdaad1ef60549353c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Buy Ralyn Foot Ralyn Shoe Care Sure Steps 2 Pairs. How-to-Use: Clean and dry area. Remove dirt from sole of shoe, using a light piece of sandpaper or emery board. Remove backing. Place on bottom of sole as shown in picture.|Ralyn Shoe Care Sure Steps 2 Pairs",
        "productname": "Ralyn Shoe Care Sure Steps 2 Pairs",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bbd",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b49e0eec-e4a3-4b41-8700-5198eedaee36_1.904b9c546bf9a86a4e2aa10a44f61121.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|",
        "productname": "Auburn Leathercrafters Tuscany Leather Dog Collar",
        "productprice": 50,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bbe",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/dcd79e5e-76b7-42f7-9664-9745be14008e_1.4053ef571358306b50aa5bee647bb6c1.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Eau De Parfum Spray 2 Oz|Women's Jimmy Choo Blossom By Jimmy Choo",
        "productname": "Women's Jimmy Choo Blossom By Jimmy Choo",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bbf",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e46db349-bef4-4815-8ff4-5a4507099799_1.1285549a858d2c76424305c5b408a0b1.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Radiant Smoothing Cream Cleanser Cleanse your way towards younger-looking, revitalized skin with Revitalift Radiant Smoothing Cream Cleaner. This gentle foaming cleanser helps to remove all traces of makeup and impurities. It gently exfoliates dead skin cells and helps enhance skin smoothness and radiance. This new generation cleanser complements your daily RevitaLift anti-aging moisturizer action.| Product Features With revitalizing vitamin C &amp; gentle exfoliating action Complements your daily Revitalift anti-aging moisturizer action Dermatologist tested for gentleness. All skin types L'Oral USA, Inc., New York, NY, 10017.",
        "productname": "L'Oreal Paris Skin Expertise Revitalift Radiant Smoothing Cream Cleanser, 5.0 fl oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc0",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f5b7f55a-1977-4fcd-b042-bdf6ab149790_1.056e8edc5d35af24b529e0b384d782ad.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|An oriental spicy fragrance for unisex Inspired by a dry &amp; hot wind in Morocco Splendid, seductive &amp; passionate Contains notes of honey, musk, incense &amp; tobacco leaf Infused with hay sugar, amber, iris, rose &amp; sandalwood Ideal for all occasions",
        "productname": "Chergui Eau De Parfum Spray-50ml/1.69oz",
        "productprice": 113,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc1",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/7d3022ff-4403-4afc-9079-46f8e589f06c_1.368aacd643c7b4328186dacb21207f16.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Toujours Moi By Dana Fragrance Giftset Set-Eau De Cologne Spray 4 Oz &amp; Cologne Spray 1 Oz For Women Sandalwood And Vetiver, With A Floral Touch And Musky Undertones.",
        "productname": "Toujours Moi Set-Eau De Cologne Spray 4 Oz & Cologne Spray 1 Oz By Dan",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc2",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4eb2c45d-088e-4a05-99a9-fc1d95a7054a_1.c511182c3eefbcc3338e508b5f90b110.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Cotton Rounds, Take Alongs, Bag 30 CT Resealable. Press to seal. Premium products. Cotton. Perfect for all your cosmetic needs! 100% cotton. Luxuriously soft - Made from 100% pure natural cotton. Textured Pad: embossed texture great for skin care; can be used to control shine. www.uscotton.com. www.swisspers.com. Made in the USA. 30 count 531 Cotton Blossom Circle Gastonia, NC 28054-5245 800-321-1029| Cotton Rounds, Take Along Resealable. Press to seal. Premium products. Cotton. Perfect for all your cosmetic needs! 100% cotton. Luxuriously soft - Made from 100% pure natural cotton. Textured Pad: embossed texture great for skin care; can be used to control shine. www.uscotton.com. www.swisspers.com. ",
        "productname": "Swisspers 30ct Round Take A Long",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc3",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/25014228-3a37-4000-87ac-153bf6931ca3_1.77d89ce8d986d934edfedfa7876d7a0c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Oliga Calura Permanent Shine Hair Color 2 fl.oz. (9-8) 9B",
        "productname": "Oliga Calura Permanent Shine Hair Color 2 fl.oz. (9-8) 9B",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc4",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/a7133b0a-8740-4bb9-b471-04aa7168c94d_1.a2cfcc7a60e1041a8ab73d6841f36fc5.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Double Wear Stay In Place Makeup SPF 10 - No. 93 Cashew (3W2) 1oz",
        "productname": "Double Wear Stay In Place Makeup SPF 10 - No. 93 Cashew (3W2) 1oz",
        "productprice": 52,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc5",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/66a69ed0-1517-492c-b559-3e41db8ef941_1.554e9cd39c5e262be7a40ae9ba4c5a08.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Be Delicious Crystallized Eau De Parfum Spray 1.7oz",
        "productname": "Be Delicious Crystallized Eau De Parfum Spray 1.7oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc6",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/cb304f91-46c0-47b9-b3e1-38b752f1f0c6_1.6e922de26930e4ad79515a5951f4da5f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Total Effects, 7 in One, Dark Circle Minimizing CC Cream, Box 0.2 OZ 7 in One. Color + correction. Brush applicator. Instant skin perfecting coverage + correction to reduce the appearance of darkness under the eyes. Total Effects Fights 7 Signs of Aging: 1. Dark Circles: immediately reduces the appearance of dark circles. 2. Fine Lines: reduces the look of wrinkles. 3. Puffy Eyes: massage to reduce the look of puffiness. 4. Loss of Firmness: hydrates for firmer skin appearance. 5. Uneven Texture: visibly renews skin texture. 6. Uneven Tone: evens skin tone. 7. Dryness: provides nourishing moisture. Why is this product right for you? This gentle brush provides instant skin perfecting coverage + correction to reduce the appearance of darkness under the eyes. For perfecting coverage + correction beyond the eyes, use with Total Effects CC Tone Correcting Moisturizer with Sunscreen. Www.olay.com. Prior to first use, click end of pen several times to begin product flow. Click 1-2 times and use the gentle brush applicator to apply product. Use finger to massage and blend any excess until absorbed. Avoid contact with eyes. If contact occurs, rinse thoroughly with water. To clean, wipe brush with dry cloth or tissue. 0.2 fl oz (6 ml) Cincinnati, OH 45202 800-285-5170|CC Cream, Dark Circle Minimizing",
        "productname": "P & G Olay Total Effects CC Cream, 0.2 oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc7",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e97e7994-7278-4b8e-8259-4d957a36c8bf_1.ce5f3f04a1d122b0eccec0c9af1ff156.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Browse through a wide collection of apparel accessories created for different occasions and styles to suit individual choices. Our items are specially designed to be attractive and affordable and would surely impress anybody with the exceptional finish and looks. Features Knit Headbands with Rhinestone Embellishment These headbands come in assorted colors One size fits most adults Case of 120 Specifications Weight: 0.21 lbs - SKU: ERS43172",
        "productname": "Eros ATT882930 Knit Headbands with Rhinestone Embellishment - Case of 120",
        "productprice": 354,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc8",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/d539eabe-6143-491a-aa20-105ac17a4906_1.b72f2d5b641150a6df8c36728d11e751.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Strawberry Shortcake 'Dolls' Compact Mirrors / Favors (4ct)",
        "productname": "Strawberry Shortcake 'Dolls' Compact Mirrors / Favors (4ct)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc9",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4ae63feb-f44f-4fd9-ab66-db776a1b5215_1.cfd7f245173306aa123ca745ee2c50ea.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Color Pop Polish - Frisky|LA Girl Color Pop Polish, Frisky, 0.47 Oz",
        "productname": "LA Girl Color Pop Polish, Frisky, 0.47 Oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bca",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4d5076cf-5289-4cc4-8d8b-0f94860bbddc_1.fddec075573305d990328c52bddf8d2f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Regarding Acrylic Acrylic is a useful, clear plastic that resembles glass. But it has properties that make it superior to glass in many ways. It is many times stronger than glass, making it much more impact resistant and therefore safer. Acrylic also insulates better than glass, potentially saving on heating bills. Adding to this favorable array of properties, a transparency rate of 93% makes acrylic the clearest material known. Very thick glass will have a green tint, while acrylic remains clear. Note : 1,Although it has a hard and clear surface, please avoid sharp scratch to keep its aesthetic. 2,Acrylic also insulates better than glass or plastic, but please don't close to the source of ignition to avoid damaging. 3,Cosmetic organizer isn't the Anti-Pressure product, please don't place too heavy articles.",
        "productname": "Beauty Acrylic Makeup Organizer Luxury Cosmetics Acrylic Clear Case Storage Insert Holder Box (1303)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bcb",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/cd582a60-da0b-47fd-b82a-0474c280a4b9.da58aacc2f50e60c89989f7b26c00b41.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Ultra Slick Lipstick - # Pure Impulse 0.13oz",
        "productname": "Ultra Slick Lipstick - # Pure Impulse 0.13oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bcc",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4b502667-29b9-4a14-a2a5-6427c99b4ca8_1.5386fbc308db80ab4da76c513a751166.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "GEL-558 I DO!|Jessica GELeration Soak-Off Gel Polish",
        "productname": "Jessica GELeration Soak-Off Gel Polish 0.5oz/ 15ml (GEL-558 I DO!)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bcd",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/a431ed46-1264-40c4-af29-0e8cc7c854a2_1.f9fdc39ae9b563630899752c8220a065.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "EDT SPRAY 1 OZ|LYON'S LEGACY EMPIRE by Simon James London EDT SPRAY 1 OZ",
        "productname": "LYON'S LEGACY EMPIRE by Simon James London EDT SPRAY 1 OZ",
        "productprice": 69,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bce",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/1d7b930f-dd14-4179-85a8-1b9d3b91805b_1.681cc84697196fa3975dbae62cff2958.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": " The item you will be getting is Tory Burch Absolu Roller Ball 0.2 oz / 6 ml Eau De Parfum. It is in the category Eau De Parfum. It is a BRAND NEW product Product condition: Sealed, Never Used. The picture is an ACCURATE REPRESENTATION. Please contact us if you need a specific batch. All our products are 100% AUTHENTIC . If there is any issue with the item, please contact us before leaving feedback. We will resolve ALL issues within 24 business hours and RESHIP VIA PRIORITY MAIL if needed. |Tory Burch Absolu Roller Ball 0.2 oz / 6 ml Eau De Parfum",
        "productname": "Tory Burch Absolu Roller Ball 0.2 oz / 6 ml Eau De Parfum",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bcf",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/64d1240f-dd69-4c39-b15e-fbc7fb851c28_1.d6beaeedbd5ae286ed78a2f9a439f8e4.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Launched in 1992 by Fubu, FUBU PLUSH is classified as a fragrance. This feminine scentis a refreshing blend of coriander, mimosa, vanilla, musk and sandalwood. It is recommended for daytime wear.",
        "productname": "Fubu Eau De Parfum Spray 1 oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd0",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/9982c1d3-add7-425b-ad42-7fc0737fcafa_1.44233b5cb411f6dc3dbd7439d4a12f05.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|CSC Spa offers a complete line of saloon and spa products. We offer high quality products for hair, skin and nails. We create unique and patented aesthetic saloon equipment, furniture and tools. We are committed to create spa furniture that is modern, functional &amp; aesthetically appealing. All of our solutions are designed with your workday in mind, with performance and savings that are always at work for you. This portable device uses bio wave energy &amp; vibration to remove wrinkles around eyes, lift facial skin and penetrate products such eye creams and essence deeper into the eye area &amp; skin. Features Bio Wave Eye Wrinkle Remover - SKU: CLSPC302",
        "productname": "CSC Spa KD-8908 Bio Wave Eye Wrinkle Remover",
        "productprice": 75,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd1",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6821b981-0275-4452-8835-06d2e30b4463_1.e74b2d06feba82fa511e6d8fc73b7045.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|",
        "productname": "Invictus by Paco Rabanne",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd2",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f7019dab-070d-42e8-9bd5-d93c2c8e7429_1.29ae2251dd18ece68ad840ca134f1afe.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "If you want to enhance the color of your hair and make sure that it stays perfectly true to you, Clairol Nicen Easy permanent color crme gives you the nicest and easiest way to refresh your look from the comfort of your home. Our breakthrough Color Care permanent crme has conditioners built into every step. It gives you 100 percent gray coverage with real natural looking tones and highlights while being kind to your hair. Whats better? Its nicen easy. Plus, it helps you keep gray hair at bay by providing real, natural looking luminous color. With Clairol Nicen Easy permanent coloring crme you get the color that cares for your hair. Color: 5 Medium Brown. Gender: Female.|Clairol Nice 'N Easy Medium Brown (Pack of 20)",
        "productname": "Clairol Nice 'N Easy Medium Brown (Pack of 20)",
        "productprice": 217,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd3",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b10fdde8-c0b4-4920-bca8-1a667022ffe9.c078ff06746ca80d84d883910ab388c3.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Adore Shining Semi Permanent Hair Color|What it is: Adore, the new and innovative, Semi-Permanent Hair Color will infuse each strand with a vibrant burst of luxurious color with No Ammonia, No Peroxide, and No Alcohol.What it does: Adore is a Semi-Permanent Hair Color that deposits natural looking color while giving your hair a healthy resilient shine, leaving your hair in better condition than before coloring.What else you need to know: Adore's exclusive formula offers a perfect blend of natural ingredients providing rich color, enhancing shine, and leaving hair soft and silky.Deionized water (Aqua), aloe vera (aloe barbadensis), citric acid, hydrolyzed collagen, octoxynol-9, hydroxypropylmethylcellulose, ppg-1, peg-9 lauryl glycol ether, methylchoroisothiazolinone, methylisothiazolinone, propylene glycol, sodium citrate, fragrance (parfum) May Contain: CI48035, CI11320, CI11055, CI51004, CI42420, CI 27720, CI48055. Shampoo, and towel dry Use protective cream around hair line Apply hair color 1/8&quot; from scalp, and comb through thoroughly Cover with plastic cap, and process with heat for up to 15 mins Rinse and shampoo completelyProduct Options Available are as follows: Color : 10 Crystal Clear Color : 104 Sienna Brown Color : 106 Mahogany Color : 106 Mahogany Color : 107 Mocha Color : 108 Medium Brown Color : 109 Dark Chocolate Color : 110 Darkest Brown Color : 112 Indigo Blue Color : 113 African Violet ado02-114 Color : 116 Purple Rage Color : 117 Aquamarine Color : 118 Off Black Color : 120 Black Velvet Color : 121 Jet Black Color : 130 Blue Black Color : 30 Ginger Color : 38 Sunrise Orange Color : 39 Orange Blaze Color : 46 Spiced Amber Color : 48 Honey Brown Color : 52 French Cognac Color : 56 Cajun Spice Color : 58 Cinnamon Color : 60 Truly Red Color : 64 Ruby Red Color : 68 Crimson Color : 69 Wild Cherry Color : 70 Raging Red Color : 72 Paprika Color : 76 Copper Brown Color : 78 Rich Amber Color : 80 Pink Fire Color : 81 Hot Pink Color : 82 Pink Rose Color : 84 Rich Fuchsia Color : 86 Raspberry Twist Color : 88 Magenta Color : 94 Bordeaux Color : 83 Fiesta Fuchsia Color : 90 Lavender Color : 71 Intense Red 4.612",
        "productname": "Adore Shining Semi Permanent Hair Color - 79 Burgundy Envy",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd4",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/8dbbc233-a903-41d4-94f5-1cc5fec8c7e7_1.e00baddeecfdc55c0c078e6ebb40866d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Juzo 30-40 mmHg, Dynamic, Knee, Max, OT, Short, 3.5cm Silicone, Model 3512MXAD3SBSH IV|Juzo Dynamic Stockings help you live an active life, more comfortably. With the high degree of containment, they deliver firm therapeutic compression for the management of Edema, Lymphedema and advanced Venous Disease.Country of Origin: &nbsp;USA and/or Imported",
        "productname": "30-40 mmHg, Dynamic, Knee, Max, OT, Short 3.5cm Silicone",
        "productprice": 74,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd5",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e906afec-6a5c-4a77-8456-b142577ac660_1.6f5c2b28c7672cd603470bfdd421dc3e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "These are first quality, tough plastic molds made by one of the leading manufacturers of candy and soap molds in the United States. They are durable and reusable. Made of clear, environmentally friendly PETG plastic. Not for use with hard candy. Cannot be washed in dishwasher. FDA approved for use with food preparation. Not suitable for children under 3.| 2 cavities; Dimensions per cavity: 4&quot;x 2-3/8&quot; lifesize; Cavity capacity in oz: 2.0 Includes FREE Cybrtrayd Copyrighted Chocolate Molding Instructions Bundle includes 6 Molds Uses: Chocolate, soap, plaster ",
        "productname": "Bulb Chocolate Candy Mold with Exclusive Cybrtrayd Copyrighted Molding Instructions, Pack of 6",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd6",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b59ca90c-b1f9-4f27-881b-6b89de2c0456_1.2c61fb96ba82cc0f071bba69ca162741.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Raspberry Chamomile Tea (Loose) (8 oz, ZIN: 530881): Our Raspberry Chamomile Tea is a delicious flavored Chamomile tea with Raspberry Leaf (Red) that you will enjoy relaxing with anytime! - Ingredients: Chamomile tea, Raspberry Leaf (Red) and natural raspberry flavor. - Hot tea brewing method: Bring freshly drawn cold water to a rolling boil. Place 1 teaspoon of tea for each desired cup into the teapot. Pour the boiling water into the pot, cover and let steep for 2-4 minutes. Strain and pour into your cup; add milk and natural sweeteners to taste. - Iced tea brewing method: (to make 1 liter/quart): Place 5 teaspoons of tea into a teapot or heat resistant pitcher. Pour 1 1/4 cups of freshly boiled water over the tea itself.|Raspberry Chamomile Tea (Loose) (8 oz, ZIN: 530881)",
        "productname": "Raspberry Chamomile Tea (Loose) (8 oz, ZIN: 530881)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd7",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/7741d0ac-66f8-41d6-8908-37646f2fe44d.a580737762b10a82eec461149eb554f2.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "This new Ames Walker lymphedema armsleeve is designed with a 1&quot; band with silicone strips to provide stay-up support. It helps to manage limb swelling, and the soft fabric makes it easy to put on and take off. The 20-30 mmHg provides firm compression should be used in cases of moderate to severe lymphedema, where there may be some shape distortion. Lymphedema armsleeves are intended to help manage edema swelling in the arm, quite often due to post-mastectomy conditions. Features: 20-30 firm compression contains edema Stylish fabric blends in with your daily wardrobe 75% Nylon, 25% Spandex Made in the USA *The ensure proper fit, please take your measurements precisely.&nbsp;If your measurements are borderline for the next size, you may consider picking the next size up to ensure a comfortable fit.|Ames Walker Women's AW Style 7061 Lymphedema Compression Armsleeve w/ Silcone Band - 20-30 mmHg AW7061-P",
        "productname": "Ames Walker Women's AW Style 7061 Lymphedema Compression Armsleeve w/ Silcone Band - 20-30 mmHg AW7061-P",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd8",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f92b8cb3-82ef-47d4-aafe-c6ac3d2d9934.a610d580682d49453969c0be77b658a0.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "#ESH - 85 watt - 82 volt - MR16 - Bi-Pin (GY5.3) Base - 2,950K | Eiko Incandescent Projector Light Bulb| Color Temperature: 2,950K Average Lifetime: 250 hours ",
        "productname": "Eiko 02760 - ESH Projector Light Bulb",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd9",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/3a191f32-d19a-4382-9e15-0bc20b13ad99.ef7db1f2954c5022620cd4f59b685f2f.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Coastal Pet Products 06343 PKB14 3/8 Inch Nylon Standard Adjustable Dog Harness, X-Small, 10 - 18 Inch Girth, Pink Bright|Our Adjustable Nylon Dog Harness features high-quality, durable nylon, making it a great everyday harness. Available in a variety of colors, this harness is completely adjustable to get just the right fit for most dogs. Plus, our unique, curved, snap-lock buckle provides added comfort at every step. Features: D-ring on back for easy leash attachment Quality guaranteed Not for use with tie-outs Ideal for walks Harnesses are great walking tools Adjustable nylon harnesses have girth and chest adjustment slides ",
        "productname": "Coastal Pet Products 06343 PKB14 3/8 Inch Nylon Standard Adjustable Dog Harness, X-Small, 10 - 18 Inch Girth, Pink Bright",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bda",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/3adb601c-b6c8-40d6-a6d5-b4ae7936037b_1.4e8cf6ed73d3eaf2627932a65662fdfc.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Jazz up your wedding, anniversary or birthday cakes with a stunning monogram from our Sparkling collection!| Unik Occasions Sparkling Collection Monogram Cake Topper, Silver: Material: Alloy and Czech Crystal Rhinestones Front of the letter is covered with rhinestones Includes 4.5&quot; long prongs ",
        "productname": "Unik Occasions Sparkling Collection Monogram Cake Topper, Silver",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bdb",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/78c21454-346f-46e1-87d3-572bfba6bd9c_1.ac947d8565c30b527165f1d5f6ad526b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "This protects flowers and edibles. Kills 100+ listed insects fast. Kills Aphids, Caterpillars, Japanese Beetles, Leafhoppers, Leaf Miners, Psyllids, Scale, Thrips, Whiteflies and other garden pests listed. Won't harm plants or blooms. Available in the following sizes: 32-ounce bottle, one gallon bottle.| Ortho Flower, Fruit &amp; Vegetable Insect Killer Ready-To-Use, 32 oz: Overview and Benefits: Available sizes: 32 oz bottle, 1 gal bottle How to Use: Shake container gently before using Adjust spray nozzle to give a fine spray Hold sprayer 8 to 12&quot; from the plant to be treated Direct spray toward the upper and lower leaf surfaces and stems where pests appear Spray only until surface is wet When to Apply: Apply to outdoor plants as soon as insect problems are noticed How Often to Apply: Days to wait to reapply: flowers and Ornamentals: 7; Vegetables: 7; Citrus Fruits: 7; Pome Fruits: 12 Max applications per season: flowers and Ornamentals: 5; Vegetables: 4; Citrus Fruits: 5; Pome Fruits: 4 Where to Apply: On roses, flowers, shrubs and listed fruits and vegetables Associated Plants: On roses, flowers, shrubs and listed fruits and vegetables See label for listed fruits and vegetables Benefits: Kills insects on Flowers and Edibles, without harming plants or blooms Packaging: Bottle Active Ingredients: 0.006% Acetamiprid This is not the product label, always read and follow the product label before use ",
        "productname": "Ortho Flower, Fruit & Vegetable Insect Killer Ready-To-Use, 32 oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bdc",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/a1a38cb1-de8a-4047-b559-90d1305ff0a1_1.3fe10dd546506e82fc0cca848d7ff1dc.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Insurrection by Reyane 3.3 oz EDT for women|Size: 3.4 oz 100 ml Fragrance Type: Eau deToilette Spray Packaging: Original RetailBox At ForeverLux, we offer only100% authentic brand name products. The item&nbsp;is&nbsp;brand new and is inthe manufacture's original packaging. &nbsp; ",
        "productname": "Insurrection by Reyane 3.3 oz EDT for women",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bdd",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/76cfbb26-daa6-41f9-9b77-4f16c8ee29a6_1.36f6577fb6aa87979917441bfd7c66d0.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Like my costume? Screen Print Pet Hoodies Bright Pink Size M (12)|A poly/cotton sleeved hoodie for cold weather days, double stitched in all the right places for comfort and durability!",
        "productname": "Like my costume? Screen Print Pet Hoodies Bright Pink Size M (12)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bde",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e81267e2-6d3f-4a9e-959e-3fa81c4c0af5_1.69a750e3dd5d4ca175f37c1aa62574ee.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "EAU DE PARFUM ROLLERBALL .33 OZ MINI|COUTURE LA LA JUICY COUTURE by Juicy Couture EAU DE PARFUM ROLLERBALL .33 OZ MINI",
        "productname": "COUTURE LA LA JUICY COUTURE by Juicy Couture EAU DE PARFUM ROLLERBALL .33 OZ MINI",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bdf",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/8b3f7834-c020-4b12-b77a-bf0227632160_1.123821ffef9e69a180959697a3077e3d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Ice Bag Relief Pak - Item Number 111061EA|Manufacturer # 111061 Brand Relief Pak&reg; English Ice Cap Manufacturer Fabrication Enterprises Application Ice Bag Dimensions 9 Inch Material Rubberized Fabric Size Circular Target Area General Purpose UNSPSC Code 42142111 Usage Reusable Features English style ice bags are made of waterproof rubberized fabric with a plastic screw cap Securely keeps ice and water melt inside the bag 1 Each / Each",
        "productname": "Ice Bag Relief Pak - Item Number 111061EA",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be0",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/3f225ede-576f-42c6-b2db-feb3106abcf8_1.0aa292d4bcb5ecfe601766c7331833c2.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Format: Retail Pkg Age: Platform: N/A Easily keep photos safe and protected while you&quot;&quot;re on the go with the Travelon Pebble Grain Photo Envelope. This cute and stylish envelope makes it easy to keep your photos safe, especially while traveling, so you don&quot;&quot;t accidentally bend or crease them. Each pouch features a cute envelope design with pebble grain exterior, and closes securely thanks to the snap closure. The envelope can easily fit photos up to 5 x 7 in size and is the perfect way to carry around holiday photos, vacation photos, and more. |Keep all your preciousphotos safe and protected Product Information Easily keep photos safe and protected while you're on the go with theTravelon Pebble Grain Photo Envelope. This cute and stylish envelopemakes it easy to keep your photos safe, especially while traveling, soyou don't accidentally bend or crease them. Each pouch features a cuteenvelope design with pebble grain exterior, and closes securely thanksto the snap closure. The envelope can easily fit photos up to 5 x 7 insize and is the perfect way to carry around holiday photos, vacationphotos, and more. Product Features Ideal way to keep photos safe, especial while traveling Features a cute envelope design with secure snap closure Envelope easily fits photos up to 5 x 7 in size Perfect for your holiday photos, vacation photos, and more Specifications Exterior Color: &nbsp;Natural (Tan) Exterior Pattern: Pebble Grain Interior Color: Green Photo Compatibility: Holds photos up to5 x 7 in size Closure Type: Snap Closure Dimensions: 7.25&quot; x 5.6&quot; x 0.6&quot; (W x Hx D, Approx) ",
        "productname": "Travelon Pebble Grain Photo Envelope (Natural)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be1",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/aa06b8d0-5506-44f1-adfb-c1b9c472c538_1.8fe1d444cf5fd5b33e3d30bd63312a19.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Slick N Smooth Deluxe Silicone Lube:|This silky smooth lubricant is the highest medical grade silicone lubricant on the market. Long-lasting and is never sticky or tacky. Does not promote bacteria growth, non-staining and has no fragrance. This is a deluxe lubricant that both partners will enjoy. Do not use with other silicone toys or products. 2.5 fl oz.",
        "productname": "Slick N Smooth Deluxe Silicone Lube",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be2",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/d6aed948-5c58-44f7-9398-b0dbd8a1d89a_1.10e82c2c479ad2a49160444432a71a6f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "689773829065|Spirits find the fragrance of Aura Accord's Conjure Oil very appealing so sprinkling it at the base of all candles before lighting to attract those spirits necessary to accomplish the intention one seeks.",
        "productname": "Conjure Aromatherapy Scented Oil Imagine Create Future Desires 2 Dram Bottle by Aura Accord",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be3",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/03ab9bb3-221c-4253-9088-44ee8137bb5a_1.bfbf5ec032f5b068dae9d05fb3e1ad39.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Features Contemporary relaxed design that delivers gradient compression therapy yet can be worn all day Reinforced heel resists shoe abrasion and strong yarns resist wear and tear All - Day Comfort Knee Band keeps socks up without binding or pinching Anti - microbial / Anti - fungal Finish promotes healthy foot care and prevents odors Latex Free Graduated Support Level - 15 - 20 mmHg Size - XL Color - Black - SKU: CMS286",
        "productname": "Complete Medical 113103 Casual Medical Legwear For Men&#44; 15-20mmhg&#44; Extra Large&#44; Black",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be4",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b3ffada5-61d1-4234-a28c-58d0b62d6ae5_1.b08dedcc0dff3b78544f7ccc41f7dbef.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Stay cool and refreshed by putting on this Hollister Newport Beach Body Spray. This product is a casual scent for men from California-inspired brand Hollister. This men's body spray has nature-inspired packaging. This fragrance features woody notes of bamboo leaves and driftwood. It gives way to deeper notes of musk to create a scent that's both crisp and mysterious. Wear this fresh scent while enjoying time outdoors, strolling the beach or hanging out with friends. It will make a handy addition to your personal care products. This personal care product comes in a convenient spray can that's 4.2 oz. Hollister Newport Beach by Hollister Body Spray 4.2oz 125ml Men:| Cool and refreshing It's a casual scent for men from California-inspired brand Hollister Features woody notes of bamboo leaves and driftwood Spray can makes it easy to applythis men's body spray Gives way to deeper notes of musk to create a scent that's both crisp and mysterious Wear this men's body spraywhile enjoying time outdoors, strolling the beach or hanging out with friends ",
        "productname": "Hollister Newport Beach by Hollister Body Spray 4.2 oz-125 ml-Men",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be5",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/cb8bbffd-c5a8-49a4-ba42-6a0fe8231e3f_1.b01b5fc0bddab2daa6ca689e1fa5aceb.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|WHAT IS THE SHELF LIFE OF SURTHRIVAL PINE POLLEN? SHELF LIFE OF PINE POLLEN TINCTURE AND DRY PINE POLLEN IS INDEFINITE. *ALWAYS STORE IN A COOL DRY PLACE AND USE FRESH PINE POLLEN TO MAXIMIZE POTENCY. USE THE POLLEN WITHIN TWO MONTHS AFTER OPENING TO PROHIBIT ANY MOISTURE FROM ACCUMULATING IN THE POLLEN. IS PINE POLLEN FOR MEN AND WOMEN? THE SHORT ANSWER...BOTH. FOR BUILDING ENERGY AND VITALITY, IN MEN AND WOMEN, ESPECIALLY AT MENOPAUSE/ ANDROPAUSE, PINE POLLEN IS FANTASTIC.",
        "productname": "Surthrival Pine Pollen Pure Potency 50ml",
        "productprice": 64,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be6",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/04f44715-c7ac-4533-8082-0a03dd1262da_1.b0ca95a3e177507759de24e9ad2eee95.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|STARWEST PLANTAIN LEAF POWDER WC 1 LB",
        "productname": "STARWEST PLANTAIN LEAF POWDER WC 1 LB",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be7",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6412bcd9-216c-4291-8287-e2324aadd484_1.491c3613cca13c55e30f631a51883604.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Those who have raised puppies know they have lessons to teach: smile more; play hard; sleep soundly; love without inhibition. These lessons and more are demonstrated in twelve charming full color photos and accompanying text. The large format wall calendar features daily grids with ample room for jotting notes; six bonus month of July through December 2017; moon phases; U.S. and international holidays.| 12&quot; x 12&quot; size (opens to 24&quot; tall x 12&quot; wide) Large spaces to write 18 months of usable grids Bonus information like holidays, observances and moon phases High-quality paper stock Protective shrinkwrap ",
        "productname": "Willow Creek Press 2018 What Puppies Teach Us Wall Calendar",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be8",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e67e14a5-9189-4670-8491-0fbd0b1f6f1f_1.4640127e96468d1330df2632777ee1be.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "water tight, heat-sealed padded seat is easy to clean and comfortable. snap on attachment. fits 6437alumex commodes. SKU:ADIB000V8DS7S|Water tight, heat-sealed padded seat is easy to clean and comfortable. Snap on attachment. Fits 6437ALumex commodes.",
        "productname": "lumex 6437s007a snap-on padded commode seat",
        "productprice": 86,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be9",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f5811e65-4925-49d4-a742-3393cb2a4907.b5b6b213f654871b9bfb89157c3e396a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Spicebomb by Viktor &amp; Rolf - Men - Eau De Toilette Spray 5 oz",
        "productname": "Spicebomb by Viktor & Rolf - Men - Eau De Toilette Spray 5 oz",
        "productprice": 144,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bea",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/dc3d6f91-bbb4-49f6-b137-18061f220696_1.5be2c7e31d398e976a0f746c79e0b113.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Counterfeit detector pen with UV light cap is an inexpensive tool for detecting bad bills with two effective tests in one convenient, pocket-size unit. Patented ink tests the paper fibers for auth- SKU: ZX9SPRCH40481",
        "productname": "Counterfeit Detector Pen&#44; with UV Light Cap&#44; Black",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498beb",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ef6f151c-f569-4b34-b97d-e9ba11a9f5d4_1.6d8ddf104f9c68232e6200ee49fc7752.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Yellow Dog Design, Inc., is a dye sublimation/heat transfer printing company specializing in the design and manufacture of a unique line of pet collars and leads, as well as Equine fashions, in their local NC facility. This line is passionate about the product as evidenced by the 5 awesome canines that come to work with us everyday, 4 Labs, and 1 Dachshund. They are our models and some of the best product testers in the industry. Our Roman Harnesses are made in the U.S.A. of 100% vibrant color-fast polyester with durable plastic slip locks, metal O-Rings and metal D-Rings. Best of all our harness is washable. Small/Medium: 3/4Width x 14-20&quot;Chest. Pattern: Tiki Print.- SKU: YLDG6824",
        "productname": "Yellow Dog Design H-TK101SM Tiki Print Roman Harness - Small/Medium",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bec",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/69e8c24e-e5ad-4f29-8f0b-ff80f55072ba_1.8cf5bd1d017237a8ca208291fb52b136.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "iScholar Pocket Portfolio Inches 30400|iScholar Pocket Portfolio Inches 30400 iScholar Twin Pocket Poly Portfolios are very durable. The two pockets hold generous amounts of letter-size documents. Ideal for school, home or work, these portfolios measure 11.5 x 9.5 inches. Assorted colors. iScholar is a leading manufacturer of school, home and office paper supplies. Enter your model number above to make sure this fits., Durable poly construction, Available in a range of bright colors (color may not be specified), Dual pockets, 11.5 x 9.5 inches, Ideal for school, work or home",
        "productname": "iScholar Pocket Portfolio Inches 30400",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bed",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b3abe0e7-a4de-4d0e-80a9-b46970f2ee93_1.d43fb1d120a528be7accdeec3a42f487.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Strong Leather Company - Side Open Double Id Removable Flip-Out Badge Case - Dress. Dr Bdg Cs Fw 2Id R/Flp 1128. Removable Flip-Out Cases Have The Unique Features Of Displaying Your Badge Either In Your Breast Pocket, On Your Belt Or Around Your Neck For All Badge Fit Information, Please Refer To The Link Below. Badge Manufacturer And Model Number Must Be Identified Before Cutout Is Selected To Ensure Proper Fit. Badge Cutout Fit Guide All Cutouts Are Considered Special Order Items And Are Non-Returnable And Cannot Be Cancelled Once Ordered. If You Need Further Information, Please Contact Your Ras At 800-359-6912.",
        "productname": "Strong Leather Company 88950-11282 Dr Bdg Cs Fw 2Id R/Flp 1128 - 88950-11282 - Strong Leather Company",
        "productprice": 52,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bee",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/a0b2118a-4e57-4318-83ce-4bb30f5129c3_1.0d1847b9be54bf5b10ba80dd3c489236.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Quality Choice NON-ASPIRIN REG STR TAB 325 100TB ",
        "productname": "5 Pack QC Pain Relief Regular Strength Acetaminophen 325mg 100 Tablets Each",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bef",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b509fc9d-f1b4-4747-9846-7f39980f78b7_1.117910a1e62f03b2a455598920abc421.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "112 M by Marilyn Miglin Eau De Parfum Spray 3.4 oz-100 ml-Women|Wrap yourself up in some classic elegance with this fragrance. It will leave you wanting for nothing more. A feminine scent with a hint of mystery just like you. 112 M by Marilyn Miglin ",
        "productname": "112 M by Marilyn Miglin Eau De Parfum Spray 3.4 oz-100 ml-Women",
        "productprice": 74,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf0",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/026ce432-6994-4447-b992-b1879caf11a8_1.dbe5beb6b519e0a7955cb69aab586205.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|A silky-creamy bronzing powder Inspired by sun-drenched destinations Adds a healthy, natural warmth to the complexion Gives a dimensional matte, sun-kissed finish Allows you to customize your glow, from a hint of light to just-stepped-off-the-beach bronze Available in a range of shades for various skin tones ",
        "productname": "Becca - Sunlit Bronzer - # Bali Sands -7.1g/0.25oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf1",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/168b822e-9b88-4cdb-a95a-eb917ce16f1c_1.5a71d54e75d02ad68ae011dc2dec4491.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "You'll look like a straight up punk rocker with this Green Hairspray. Mix it with black for an edgy look! Don't limit this just to Halloween, use it all year round to change up your style!|Green Hairspray",
        "productname": "Green Hairspray",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf2",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/184e1003-6f8d-4e10-b1c9-2148d65ac9e5_1.45eb16a449a8fd83867d45a21368d652.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "***LOOKING TO PUT TOGETHER A PARTY? - ADDITIONAL ITEMS FROM SELLER SHIP FOR $.75 EACH***|Put some The Party Continues 60th Birthday Confetti into the invitation envelopes as a little taste of the festivities to come. At the party, sprinkle some on the table around the cake to add some shine. The confetti includes colorful dots and stars plus happy birthday and 60 cutouts.",
        "productname": "The Party Continues 60th Birthday Confetti - Party Supplies",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf3",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/5d9caf92-cd47-4a0e-bc32-7dfa3f41acb3_1.cde15a8b407ad7e605806ecc70bad876.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Combination Board Porcelain Markerboard and Vinyl Fabric Tackboard- 4'x10' Style C with Aluminum Framed Marker Board and Tack Board. Combination Boards Overall Size: 48-7/16&quot;- SKU: ZX9GHENT2530",
        "productname": "4 ft. x 10 ft. Style C Combination Unit - Porcelain Magnetic Whiteboard and Vinyl Fabric Tackboard - Ocean",
        "productprice": 446,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf4",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/01ff7ccc-dc90-4e10-8873-682a03b34916_1.8c49d458d7ddf571ba90d5b029237e9a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Medium Weight Color Karate Uniform, Red| &nbsp; Medium Weight Red Karate Uniform Specifications Full elastic pants waistband with pull string. Reinforced stitching at the inseams Gusseted (triangular insert) crotch provides added strength and durability. Jacket sleeve cuffs and pant hems are multiple-stitched to endure any rigorous workouts. Machine washable poly-cotton blend material allows for easy care. White belt, jacket, and pants included. This Medium Weight Red Karate Gi is durable enough for the most intense training and competition. Cuffs and hems are stitched 6 times to resist stress and wear and tare. The polycotton material allows for easy care of your machine washable karate gi. The pants feature an elastic waistband with drawstring for comfortable fit and easy adjustments. &nbsp; ",
        "productname": "Medium Weight Color Karate Uniform, Red",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf5",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/5b3c5459-251a-46af-aad2-7e558ca1e4ba_1.134854c0ccbb80fd6e43f6f198c26080.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Amsino Amsure Piston Enteral Irrigation 60ml 60cc Syrigne - 1 Piece. Catheter Tip. 60ml Thumb Control Ring Top Irrigation Syringe. Tip Protector.|AMSure Enteral Feeding/Irrigation Syringe 60 mL Pole Bag Resealable Catheter Tip w/o Safety Case of 30",
        "productname": "AMSure Enteral Feeding/Irrigation Syringe 60 mL Pole Bag Resealable Catheter Tip w/o Safety Case of 30",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf6",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/55c5bf8c-e780-4dfb-935b-d73566751cad.d89c789601b2c13d2f8b8a0c82cd1c59.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Features: -Bulletin board. -Lockable doors. -Acrylic safety glass windows. -Continuous hinges. -Concealed mounting brackets. -Made in USA. Product Type: -Bulletin board. Mount Type: -Wall Mounted. Board Color: -Brown. Surface Material: -Cork. Framed: -Framed. Frame Material: -Plastic. Size 24&quot; H x 18&quot; W - Size: -Small 2' - 4'. Size 36&quot; H x 60&quot; W - Size: -Medium 4' - 6'. Size 48&quot; H x 96&quot; W - Size: -Large 6' to 8'. Dimensions: Overall Thickness: -2&quot;. Size 24&quot; H x 18&quot; W - Overall Height - Top to Bottom: -24&quot;. Size 24&quot; H x 18&quot; W - Overall Length - Side to Side: -24&quot;. Size 36&quot; H x 24&quot; W - Overall Length - Side to Side: -36&quot;. Size 36&quot; H x 24&quot; W - Overall Product Weight: -18 lbs. Size 36&quot; H x 30&quot; W - Overall Product Weight: -24 lbs. Size 36&quot; H x 36&quot; W - Overall Height - Top to Bottom: -36&quot;. Size 36&quot; H x 36&quot; W - Overall Product Weight: -40 lbs. Size 36&quot; H x 48&quot; W - Overall Length - Side to Side: -48&quot;. Size 36&quot; H x 48&quot; W - Overall Product Weight: -42 lbs. Size 36&quot; H x 6|AAO1191 Features Bulletin board Lockable doors Acrylic safety glass windows Continuous hinges Concealed mounting brackets Made in USA Product Type: Bulletin board Mount Type: Wall Mounted Board Color: Brown Surface Material: Cork Framed: Framed Frame Material: Plastic Size (24&quot; H x 18&quot; W): Small 2' - 4' Size (36&quot; H x 60&quot; W): Medium 4' - 6' Size (48&quot; H x 96&quot; W): Large 6' to 8' Dimensions Overall Thickness: 2&quot; Size 24&quot; H x 18&quot; W Overall Height - Top to Bottom: 24&quot; Overall Length - Side to Side: 24&quot; Size 36&quot; H x 24&quot; W Overall Length - Side to Side: 36&quot; Overall Product Weight: 18 lbs Size 36&quot; H x 30&quot; W Overall Product Weight: 24 lbs Size 36&quot; H x 36&quot; W Overall Height - Top to Bottom: 36&quot; Overall Product Weight: 40 lbs Size 36&quot; H x 48&quot; W Overall Length - Side to Side: 48&quot; Overall Product Weight: 42 lbs Size 36&quot; H x 60&quot; W Overall Length - Side to Side: 60&quot; ",
        "productname": "AARCO Enclosed Wall Mounted Bulletin Board",
        "productprice": 586,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf7",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/18767ea7-1421-4b77-a360-294c030db3d3_1.400c145abd708834fb19a385e6ff182f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Deluxe Literature Mailer| Features protective side flaps and front outside tuck closure Maximum protection for your most important documents Manufactured from strong 200#/ECT-32-B oyster white corrugated All ship and store flat to save space ",
        "productname": "Box Packaging White Deluxe Literature Mailer, 50/Bundle",
        "productprice": 219,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf8",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/0780e533-8875-4793-b01e-551d9e7881ef_1.c97a52a8c8595c79fbd13c9af6cdbf97.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Perfect for all your paper crafting projects! This package contains twenty-five 12x12 inch double-sided sheets with a different design on each side (all twenty-five sheets are identical). Comes in a variety of designs. Each sold separately. Acid and lignin free. Made in USA.",
        "productname": "Doodlebug 7311164 New! Simple Sets Hello Lovely Double-sided Cardstock 12\"x12\"-so Very Lovely - Case Pack Of 25",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf9",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/8dd7a6ef-2df6-4fe9-87ed-6ec39ed7d360.c62de8d376e41fc09458fbe4be10408c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "The Matte Colored Corrugated Mailing Boxes are available in a variety of sizes and gorgeous colors. Perfect for small business owners wanting to ship products to their customers in a unique and durable mailing box. Also, makes a great gift box and product packaging box. These mailing boxes feature a tab lock tuck top that will keep your items secure. We ship these boxes flat. Assembly is easy to fold together and does not need any adhesives to hold its shape. Sizes are the outside dimensions of the box.| Quantity: 10 Material: Paper ",
        "productname": "10ea - 16 X 11-1/8 X 6-3/8 Blue Corrugated Tuck Top Box-Pk by Paper Mart",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bfa",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/86670a56-233e-489d-b124-3f54394ad196_1.01e371a9f5e44c590d944f70e9f0c9be.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "This item is guaranted to produce dark long lasting printing on your calculator when you install this C.ITOH Model 200 Compatible CAlculator RS-6BR Twin Spool Black &amp; Red Ribbon by Around The Office|Package of 3 individually sealed RIBBONS, Designed to fit C.ITOH 200 calculator by Around The Office&reg;, Freshly inked supplies provide dark long-lasting use, Live Customer Support for installation, Unconditional Guarantee",
        "productname": "C.ITOH Model 200 Compatible CAlculator RS-6BR Twin Spool Black & Red Ribbon by Around The Office",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bfb",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ee75c3ab-ce48-4295-8ca7-b0d20243ec49_1.ff6b9f4dde408743b9401b15f73e784e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Announce your event using a classic Gatefold style invitation! The stock is scored so the gate doors meet perfectly in the middle, opening to reveal your invitation. For endless possibilities, position your invitation and add a Layer Card to show your own unique style.| Envelopes.com 6-1/4&quot; x 6-1/4&quot; Gatefold Invitation: Size: 6-1/4&quot; x 6-1/4&quot; Paper weight: 105 lb ",
        "productname": "6 1/4 x 6 1/4 Gatefold Invitation - Mandarin Orange (500 Qty.)",
        "productprice": 212,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bfc",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f5b71072-aff2-4ba7-a3ef-09dc1bb30b29_1.a7cc36ed62cea7fb691656517762c1c8.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Bazzill Bling Cardstock 8.5 Inch X 11 Inch-Fresno|BAZZILL-Take top quality cardstock with a touch of shimmer and canvas texture and you have Bling! Size: 8.5x11. Sold in pack of 25/all same color and style (Not sold as individual pieces). Acid and Lignin-Free. Make in China.",
        "productname": "Bazzill Bling Cardstock 8.5 Inch X 11 Inch-Fresno",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bfd",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/1f01759a-9c9a-4d50-a42a-546991c11ce5_1.12f0da4836ec758cd36c16b7f63756d3.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "RHINO 4200 PRINTER|DYMO CORP 1801611 RHINO 4200 PRINTER 1801611 RHINO 4200 PRINTER",
        "productname": "DYMO CORP 1801611 RHINO 4200 PRINTER 1801611",
        "productprice": 117,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bfe",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c7f2acaf-1cae-4f56-bccb-092b9864394f.411a9c95499021f418c87e4da547d0e2.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "A notelet featuring pop-out flaps to transform the package into an envelope. The Moleskine Postal Notebook has a cardboard cover; 8 plain inner pages (100 gsm/68 lb.) of ivory-colored paper; stitch bound in same color as cover; blind debossed Moleskine logo. Specifications: - Layout: Plain Paper - Dimensions: 4-1/2&quot; x 6-3/4&quot; - Soft Cover - Color: Persian Lilac - Pages: 8 - Paper Weight: 100 gsm/68 lb.; FSC Certified Paper; Acid-Free (pH Neutral)|A notelet featuring pop-out flaps to transform the package into an envelope. The Moleskine Postal Notebook has a cardboard cover; 8 plain inner pages (100 gsm/68 lb.) of ivory-colored paper; stitch bound in same color as cover; blind debossed Moleskine logo. Specifications: - Layout: Plain Paper - Dimensions: 4-1/2&quot; x 6-3/4&quot; - Soft Cover - Color: Persian Lilac - Pages: 8 - Paper Weight: 100 gsm/68 lb.; FSC Certified Paper; Acid-Free (pH Neutral)",
        "productname": "Moleskine Messages Postal Notebook, Large, Plain, Persian Lilac, Soft Cover (4.5 x 6.75)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bff",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b01669c8-916f-40dc-8bb8-9e17f86aac20_1.9dbe445b80e2d8c98541f3d77c4775fa.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|FBA|SS-CA-SR-FBA||6 Pack of Black/Red ink ribbons",
        "productname": "Compatible Universal Calculator Spool EPC B / R Black and Red Ribbons, Works for Sharp EL 1197 P, Sharp EL 1197 P II, Sharp EL 1197 P III, Sharp EL 1630",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c00",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ee25c9ad-f44e-4469-b39a-3a303d120473_1.c168fc68aa323e2c38aa864b6f6d57ff.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "100 New Resealable|100 New Resealable Plastic Bags This is a new set of 100 resealable plastic bags These high quality reclosable plastic bags allow you to have the bags you use most on hand The reclosable seals open all the way to the edges of the bags giving you full use of the interior. Each has a 2 mil thickness and measures approximately 4&quot; x 6&quot; (101 x 152 mm)",
        "productname": "100 CLEAR Reclosable Zipper Bag. 4' x 6' - 2 mil. thick",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c01",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/deb4f62c-67cc-4fc4-ae4d-27e0af557e3c_1.b3b4d2c439021be22790564d1df437b2.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|We provide a wide range of products to satisfy all houseware and supplies. We are dedicated to give everyone the very best houseware supplies for all home needs, with a focus on dependability, our client satisfaction and great quality. We provide high-quality modern products to be enjoyed by many clients. Our aim is continuous improvement and user satisfaction through effective implementation and quality of our products. Features 2 x 800 in. Super Clear Seal Tape - SKU: MCDS22502",
        "productname": "Merchandise 55548609 2 x 800 in. Super Clear Seal Tape",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c02",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c7d1ed72-e1ab-4fb7-8f21-b0abdb7bcbf7_1.e993a7c0b4f9d6e29a423a787c54db84.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Features Porcelain writing surface is indestructible when used as directed and guaranteed for life High contrast Excellent erasing qualities Surface permits use of magnetic accessories All writing board units are equipped with a 1 in. map rail with a tan cork insert and end caps All trim, tray and map rails are finished in satin anodized aluminum Accessory tray runs full length of writing surface 120D Series accessory tray with protective end cap Board Type - Markerboard Size - 4 x 8 ft. Color - Buttercup - SKU: AARC7663",
        "productname": "Aarco Products 120D-48M-242-854 Combination Tackboard at Each End&#44; Buttercup - 4 x 8 ft.",
        "productprice": 354,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c03",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b55a3e56-f04e-477d-85a2-8a4306104a34_1.f798701a467d033116767c9f77b5b298.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Fusion Double-Sided Cardstock 12&quot;X12&quot;-Yellow Damask|More Info: RUBY ROCK IT-Fusion Double-Sided Cardstock. Perfect for scrapbooking! This package contains ten 12x12 inch double sided sheets with a different design on each side (all ten sheets are identical). Comes in a variety of designs. Each sold separately. Acid free. Imported.",
        "productname": "Fusion Double-Sided Cardstock 12\"X12\"-Yellow Damask",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c04",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e370e96a-e2f7-4ec9-a781-b7027893ad1a_1.6e5536e48321a4104fb549092b9f5f68.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Strong Leather Company - Deluxe Hidden Badge Wallet. Del Sgl Id Bdg Wal 793. This Upgraded Version Offers The Same Advantages Of Badge And Id Concealment. It Also Boasts More Card Slots Along With A License Window, Money And Photo Sections. For All Badge Fit Information, Please Refer To The Link Below. Badge Manufacturer And Model Number Must Be Identified Before Cutout Is Selected To Ensure Proper Fit. Badge Cutout Fit Guide All Cutouts Are Considered Special Order Items And Are Non-Returnable And Cannot Be Cancelled Once Ordered. If You Need Further Information, Please Contact Your Ras At 800-359-6912.",
        "productname": "Strong Leather Company 79230-7932 Del Sgl Id Bdg Wal 793 - 79230-7932 - Strong Leather Company",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c05",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/445f68a7-0c3a-4ba5-a593-815b81bcb9c5.d506f3f0473ed8cbba3a4b08daf21429.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Wire Marking Sleeves, Color White, Width 2 In., Height 7/16 In., Material PermaSleeve(R), Min. Wire Size 3/32 In., Max. Wire Size 7/32 In., For Use With Mfr. No. BBP33, Labels per Roll 500, Shrink Ratio 3:1, Temp. Range -67 Degrees to 275 Degrees F, Standards SAE-AMS-DTL-23053/6 (Class 1), SAE-AS-81531, MIL-STD-202G, Method 215K Features Temp. Range: -67 Degrees to 275 Degrees F Color: White Shrink Ratio: 3:1 For Use With: Mfr. No. BBP33 Max. Wire Size: 7/32&quot; Item: Wire Marking Sleeves Labels per Roll: 500 Height: 7/16&quot; Standards: SAE-AMS-DTL-23053/6 (Class 1), SAE-AS-81531, MIL-STD-202G, Method 215K Width: 2&quot; Material: PermaSleeve(R) Min. Wire Size: 3/32&quot; | Item Type: Wire Marking Sleeves Brand: BRADY Manufacturer Part Number: B33D-250-2-344 ",
        "productname": "BRADY Wire Marking Sleeves,2in.Wx7/16in.H B33D-250-2-344",
        "productprice": 567,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c06",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/d0790e31-11e6-4288-8140-099bc83ee55c_1.7159e94d7aeaafab73e9ede1473a87a6.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "SyPen BRINGS YOU THIS AMAZING 3-IN-1 MULTI-FUNCTION CAPACITIVE STYLUS BALLPOINT LED PEN THAT MAKES YOUR DAY-TO-DAY LIFE EASIER! No other pen on the market comes with as many advantages to its users as ours! This pen operates as a stylus pen for use on the surface of your touchable screen devices, it features an LED light on one end, and also functions as a real writing pen. Finding a pen with these 3-in-1 functions is very rare! OUR PEN IS CONVENIENT, HELPFUL &amp; STYLISH ALL AT THE SAME TIME The removable cap functions as both a pen cover and a stylus for you to use on all your electronic devices that feature a capacitive screen display. Our stylus pen lets you easily glide across your device's screen, thus keeping your touch screen smudge-free at all times! This Metal pen also features a special LED light on the opposite end. Ever have that problem when you're going through your bag full of many items and you can't locate your car keys or hom| 3-IN-1 COMBINATION: SyPen offers our amazing stylus pen, which operates on smart devices, works as an LED flashlight, and also can be used as a standard ballpoint pen! SHED SOME LIGHT: Always be prepared with our uniquely designed stylus pen, which includes an LED flashlight feature! Be ready at night and in dim situations! Simply push the flashlight tip to turn the small white LED light on and off. DURABLE and ULTRA SENSITIVE RUBBER TIP: SyPen designs products that are made to be used again and again! Our stylus pens are made of a special metal material which is stronger than most. The chrome lower barrel and shiny accents give the pen a sophisticated appearance.The Premium Soft rubber tipped end with sensitive touching helps reduce scratches and fingerprints on any touch device, works exactly like you finger. MANY VARIATIONS: This special pen is available in the colors of Red, Silver, Gunmetal, Black, Green, Pink and Blue. You can also choose from a pack of 1 piece, 6 pieces, and 12 pieces. COMPATIBILITY AND PORTABLE: 100% Compatible with all Capactive touch screen devices (Apple iPad 1 and 2, iPhone, iPod, Kindle, Motorola Xoom Tablet, Galaxy, and Blackberry Playbook Virtuoso Touch) and small size clip which can easily be placed in your pocket, purse, or wherever you like! Keep it handy and never be without one! ",
        "productname": "SyPen Stylus Pen for Touchscreen Devices, Tablets, iPads, iPhones, Multi-Function Capacitive Pen With LED Flashlight,Ballpoint Black Ink Pen, 3-In-1 Metal Pen, 6PK, Black Ink",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c07",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/077aed26-b97a-49cd-9397-e065b2e52999.d6f9278b41ee2321e85ffff44506c7a7.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|17&quot; x 17&quot; x 6&quot; Corrugated Boxes. Quality standard strength industrial Corrugated Boxes. Manufactured from 200#/ECT-32 kraft corrugated. Cartons are sold in bundle quantities and ship flat to save on storage space and shipping. 20/Bundle.",
        "productname": "Corrugated Boxes SHP17176",
        "productprice": 75,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c08",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/1e697b09-de0e-4164-9f45-bbf6df1c6299_1.3ef093301fc5b789e116686069756005.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Size :9.0&quot;(L) x 5.5&quot;(W) inches , 7.48&quot; x 0.71&quot; x 2.17&quot; inches.Lightweight and convenient and easy carry.Stylish and attractive outlook.Keep stationery safe with this special pencil case.| Size :9.0&quot;(L) x 5.5&quot;(W) inches , 7.48&quot; x 0.71&quot; x 2.17&quot; inches. Lightweight and convenient and easy carry. Stylish and attractive outlook. Keep stationery safe with this special pencil case. ",
        "productname": "POPCreation Floral School Pencil Case Pencil Bag Zipper Organizer Bag",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c09",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4d4adcbe-9cf0-4e21-9aca-06c2773ad323_1.7d6c778597cba765b01fd0740e13963f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Stuffed Eggplant (turkili) 400g",
        "productname": "Stuffed Eggplant (turkili) 400g",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c0a",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/2831b220-0e9f-4518-8c21-75096902735b_1.9f1989e4fdb3f249d405883f6563a535.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Pet Products has unique directory gives pet lovers local access to the products and services they need for their pets. We provide pet owners a one-stop for products, research, reviews, and local information. These products meet the needs of the pet industry to provide data needed to gain insights into the pet market. We are striving to be the largest pet products directory in the world. Features K9 Natural Freezed Beef Specifications Food Type: Beef - SKU: PTFDE9449",
        "productname": "PetFoodExperts 57577903 K9 Natural Freezed Beef",
        "productprice": 171,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c0b",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/d676c277-bb25-44be-bacd-6fdba433b559_1.8deecfa3ec6ed94130e0a1ef12186263.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|La Source Relaxing Body Lotion 8.5oz",
        "productname": "La Source Relaxing Body Lotion 8.5oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c0c",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/2165f7b9-d60d-460b-9c63-78fcf95bc2ca_1.acbb580ab74b5e6fd27059b5f763a416.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "A smooth consistent sheet in the colors you need. Excellent print and run ability. Our Springhill&nbsp;digital opaque colors come with our electronic imaging guarantee| Guaranteed to run on small and large offset presses, copiers, laser and inkjet printers, as well as plain-paper fax machines 10% PCW Wood sourced from a FSC certified managed forest This product was made from Wood sourced from a FSC certified managed forest Electronic imaging guaranteed A smooth consistent sheet in the colors you need ",
        "productname": "Springhill Digital Opaque Colors Tan, 60lb, Ledger, 11 x 17, 500 Sheets / 1 Ream, Made In The USA",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c0d",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f4adb5b6-9a1e-4a00-8fba-7f67a4ef0191.755d095c180c261dfa63ca8bda31eaca.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Add your own personal message to customize at no additional charge! Once you receive your confirmation email from Walmart, click the &quot;Contact A Birthday Place&quot; link to message us your personalization request. If we do not receive a message within one hour of your order, we will assume you want the topper as-is and with no personalization. Edible icing art is a great way to make a cake and cupcakes look fantastic and professional. These are an easy and inexpensive way to make your cake look like a masterpiece. All icing images come with instructions. Simply remove the edible icing art from backing and place on top of freshly iced cake or cupcakes. After 15 to 25 minutes the edible icing art will blend with the frosting to give your cake a professional look. Prints are professionally printed on compressed icing sheets. Each topper is shipped in a plastic zip lock bag. No refrigeration is necessary! Kosher! Gluten Free! Soy Free! Trans-Fat Free! No Known Allergens! No Peanut Products Added! Printed on high quality edible icing paper (not wafer or rice paper) using high quality edible ink, also certified kosher. Ingredients: Water, Cornstarch, Corn Syrup Solids, Cellulose, Sorbotol, Glycerine, Sugar, Vegetable Oil, Arabic Gum, Polysorbate 80, Vanilla, Titanium Dioxide, Citric Acid. Looking for another theme or design? Contact us for more options!|1/4 Sheet Lego Batman Edible Frosting Cake Topper-*",
        "productname": "1/4 Sheet Lego Batman Edible Frosting Cake Topper-*",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c0e",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4be522d5-08a9-4c72-8d5a-d66a95d44900_1.23cea704dcce1f55a2183e8016aa432b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Features 3-Part White Carbonless Continuous Computer Forms Size - 8 1/2 in. x 11 in. 1050 forms per case Dimension - 11.5 x 9 x 12 in. Item Weight - 25 lbs. - SKU: ADBS184",
        "productname": "Prime-Kote U24 8.5 x 11 3-Part White Carbonless Computer Forms",
        "productprice": 96,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c0f",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/3b5b1bfb-afd8-49d5-9731-42a99745c6f5_1.87018cb6fdcbbd4249b3b0ae220d7434.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|An intensely moisturizing conditioner for dehydrated curls Concentrated with vitamins &amp; botanicals to soften &amp; nourish dry &amp; unruly curls Detangles hair while repairing damage from excessive heat styling &amp; chemical processes Blended with algae extract &amp; wheat amino acids to retain moisture &amp; shield hair Reveals shinier, healthier &amp; more manageable curls Safe for color treated, permed &amp; straightened curls",
        "productname": "Curl Quencher Moisturizing Conditioner (Tight Curls)-1000ml/33.8oz",
        "productprice": 76,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c10",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e9cde4f4-0193-461b-9f7c-4a30f6f62646_1.522355c12b4b0a57853d1254d6ca5924.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|CLARINS DOUBLE SERUM &amp; EXTRA FIRMING COLLECTION SET",
        "productname": "CLARINS DOUBLE SERUM & EXTRA FIRMING COLLECTION SET",
        "productprice": 67,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c11",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e2f0442f-de46-4aff-9c1c-b12c54da0f15_1.b73a6209ec61f94b6c9807580424ed8e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "These are first quality, tough plastic molds made by one of the leading manufacturers of candy and soap molds in the United States. They are durable and reusable. Made of clear, environmentally friendly PETG plastic. Not for use with hard candy. Cannot be washed in dishwasher. FDA approved for use with food preparation. Not suitable for children under 3.| 9 cavities; Dimensions per cavity: N/A; Cavity capacity in oz: 0.7 Includes FREE Cybrtrayd Copyrighted Chocolate Molding Instructions Bundle includes 3 Molds Uses: Chocolate, soap, plaster ",
        "productname": "Shell Assortment Chocolate Candy Mold with Exclusive Cybrtrayd Copyrighted Molding Instructions, Pack of 3",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c12",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/06af90b8-7327-4784-9094-00af84430c00.7eb02a3e7ebf1ff012c113e393f41024.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "18 flavor strips Size SA43 1 3/4 by 3 19/32-SA43 size can be used on Vendo (tear side) as well as Dixie Narco (tear top) Size SA36 1 15/32 by 3 1/2- size can be used on Vendo as well as Dixie Narco The Affordable Care Act, or Obamacare, has lots of little hidden provisions that are slowly emerging to try to force you to be healthy. One of these is the requirement that vending machines show calorie count on each item sold. We have now updated many our our popular flavor strips to the newer style showing calorie count. Please look for them on on our flavor strip pages. These are the original flavor strips that are used by national bottling companies, not copies! These strips have small punch out holes for sold out lights Should newer design strips become available before the pictures are updated the newer design strips will be shipped.|Vending-World - 18x Flavor Strip For 12 oz Cans Soda Pepsi Coke Vending, fits Dixie Narco, Vendo",
        "productname": "Vending-World - 18x Flavor Strip For 12 oz Cans Soda Pepsi Coke Vending, fits Dixie Narco, Vendo",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c13",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/a739c6b5-8748-4fbe-9c30-b7686a8c4d9a_1.570e8b65e01418afc18a20938e84dc0f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Economy Grade Sign - Made of .032&quot; aluminum with a High Gloss Finish (28% thicker than other .025&quot; aluminum and tin signs), this 8 inch by 12 inch sign is made in the USA with American made materials and American craftsmanship. It consists of an image baked into a HIGH GLOSS powder coating over aluminum. The image has the appearance of an aged and weathered sign with simulated rusted edges and scratched and faded paint on a HIGH GLOSS powder coated finish. It has smooth rounded corners and includes mounting holes. Each sign is made to order and individually handcrafted. You will find reproductions, vintage looking original designs, clean, new looking signs without the rust and scratches, and many personalized designs. Our signs make great gifts and they are also perfect for your home, office, business, garage, man cave, she shed, dorm room, game room, kitchen or any place you'd like to display this unique sign. We have several thousand different designs available with more being added every day. Personalization:We offer many styles of personalized signs, many that can be customized with names or important dates. The price of this sign includes FREE SHIPPING which usually takes 3 to 5 days in the United States. Edonomy Grade -&nbsp; Made out of .032&quot; thick aluminum (28% thicker than .025&quot; aluminum or tin signs) with a HIgh Gloss finish Durable aluminum won't rust, 8 inches x 12 inches w/ rounded corners and mounting holes Made and shipped in the USA. Don't be fooled by cheap counterfeit signs from overseas. This is American Made! Usually SHIPS IN 1 to 2 DAYS. RECEIVE IT in 4-5 DAYS from a USA Mfr. | Made out of Economy .032 inch thick aluminum (28% thicker than .025 aluminum or tin) with a HIGH GLOSS finish. Distressed versions have simulated rusty edges and faded paint and scratches to give a nice aged and worn look. This one is a HIGH GLOSS FINISH Durable aluminum won't rust, 8 inches x 12 inches w/ rounded corners and mounting holes. Made and shipped in the USA. Don't be fooled by cheap counterfeit signs from overseas. This is American Made! SHIPS IN 1 to 2 DAYS. RECEIVE IT in 4-5 DAYS from a USA Mfr. ",
        "productname": "Brooke's Green Wine Bar Personalized Sign Wall Decor 8 x 12 High Gloss Metal 208120043513",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c14",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f6d12f99-8920-4ffa-8ec8-e435943f7f66_1.d68c24474f513e1e631e21898df7f4c7.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "One time use tamper evident pull-tight adjustable security seals. Allows the user to cinch-up the seal according to their specific size requirements.A heavy-duty, adjustable security seal designed for use on transportation and storage equipment or anywhere a multi-locking, tamper evident pull-tight security device is needed. Ideal for situations requiring varying seal lengths.Heavy-duty, all plastic, one-piece construction.Tamper-resistant acetal locking mechanism.Weather resistant; withstands extremes of cold and heat.Consecutively numbered.Matted in strips of 10 for ease-of-use.| Tug Tight Pull-Tight Seals SKU :-- SE1009 Color :-- Green Size :-- 15 Inch Material :--Plastic Material Handling Seals Pull-Tight Seals Made In USA",
        "productname": "SE1009 Green 15 Inch Plastic Tug Tight Pull-Tight Seals Made In USA CASE OF 100",
        "productprice": 74,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c15",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/50c435bc-0766-4f95-83c5-0f3d0262ddaf_1.20d8ea011ddc2ed0aa6799953593e5e3.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Features Raspberry Bath Bomb Specifications Size: 4.5 oz Scent: Raspberry, Subtle Floral Hint. Country of Origin: United States - SKU: GRNLF5588",
        "productname": "mooi lab d6184096-4.5-oz Raspberry Bath Bomb&#44; 4.5 oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c16",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/836585cd-3f57-48d2-a5de-90c5975b15d1_1.9be90a508c8884622a13e17de06f3691.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Granulated Honey This granulated honey is so versatile it offers the delicate, heady flavor of honey in an easy to use form especially for baking! Tiny granules of rich, golden honey (which are about the size of pin heads) are easy to measure in place of sugar for cakes, cookies, pie crusts and can be used in other desserts such as sprinkling over grilled fruit, creme brulees or French toast. Because they are so small and dissolve easily, you can also substitute granulated honey for liquid form honey in savory recipes such as marinades, or use as sweetener for coffee, tea, lemonade and cocktails.Through a unique crystallization process, granulated honey is produced by combining honey and sugar to form this freeflowing product. Granulated honey contains 8-10% honey. |Granulated Honey",
        "productname": "Granulated Honey",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c17",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/8055bdbd-a4dc-4bea-8035-4337d8bd237e.044ce7047aeb36b91e336716ff510c9b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "Stunning Looking Cat Eye Two Tone Reading Glasses give You an Upscale Look. These Designer Readers will get plenty of compliments. Top Quality Frames with Spring Metal Hinges make them Sturdy yet they have a very Comfortable Fit - You'll Forget you have them on. You'll find them Hard to Live Without. Includes a High Quality Hard Case and Cleaning Cloth, each with an In Style Eyes Logo.|In Style Eyes Cateye Two Tone Reading Glasses",
        "productname": "In Style Eyes Cateye Two Tone Reading Glasses",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      }
     
     ]
  
    try {
      // Find the seller by their email
      const seller = await User.findOne({ email: sellerId });
  
      if (!seller) {
        return res.status(404).json({ error: 'Seller not found' });
      }
      console.log(seller);
      // Add the data to the seller's inventory
      seller.inventory.push(...data);
  
      // Save the updated seller document
      await seller.save();
  
      return res.status(200).json({ message: 'Data added to inventory successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };


  export const dummyroutewarehouse = async (req, res) => {
    console.log("here");
    const sellerId = "ahmedpandit48@gmail.com";
    const data = [
      {
        "_id": "646fa2b5255025ab59498b6d",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/03665374-74d3-4925-a82f-ad0e770f6b0f_1.d71ae4304bda899e9d6cbcc6d2cdd942.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "Schiff Buffered Vitamin C Dietary Supplement Tablets' formula combines vitamin C with rose hips (a natural form of bioflavonoids) and is buffered in case the acidic nature of vitamin C irritates your stomach. Vitamin C is needed as a coenzyme for many metabolic pathways. Vitamin C is a powerful antioxidant with important roles in connective tissue, bone and skin health, immune function, and cardiovascular health. It is also necessary to convert folic acid into its active form and helps the body absorb iron.|Schiff Buffered Vitamin C Dietary Supplement Tablets: Supports healthy immune function With rose hips ",
        "productname": "Schiff Buffered Vitamin C Dietary Supplement Tablets, 500 mg, 100 count",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b6e",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/19aa88cc-339a-4ddc-8f6d-1dd687a398ac_1.2594c9758f470216b102f2c7969db374.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "The Therall Heat Retaining Back Support is constructed with four-way stretch material for light compression. Material has ceramic fibers that retain heat and slowly reflecting it back into the joint and surrounding tissues. The result is therapeutic heat penetrated deep into the aching joint, muscles and surrounding tissues to provide long-lasting, soothing relief. Support promotes healing by increasing circulation around the tender joint and improves joint mobility to allow for faster return to daily activities. Can be used with Therall Body Warmer Patch (sold separately) for over 12 hours of soothing heat therapy.| Material has ceramic fibers that retain heat Can be used with Therall Body Warmer Patch Constructed with four-way stretch material ",
        "productname": "FLA Therall Heat Retaining Back Support - X-Large",
        "productprice": 58,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b6f",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/006495e5-6daa-42c8-9232-62b993228a3c_1.1af61c0a1da56fc54189c9bcf7184ea3.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "VERA WANG Sunglasses MIELA Crystal 53MM|Brand new authentic VERA WANG Sunglasses in color Crystal. This Sunglasses frame size is 53-20-140. This model is a, Female frame and comes with everything you would receive if you purchased it at a local retail store. Shop with confidence.",
        "productname": "VERA WANG Sunglasses MIELA Crystal 53MM",
        "productprice": 234,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b70",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/d4f6768d-abd3-421f-b6ea-a1d94bcdbd32_1.795c8e6377eb190b35e57d7481e45097.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "|Unda - Muco Coccinum 10 tabsProduct overview:Plex Remedies are condition-specific homeopathic specialties prepared in low dilutions and are recommended for acute and chronic ailments. The product range helps support: the digestive, hormonal, immune, musculoskeletal, nervous, respiratory, skin, oral and vascular systems.Established over half a century ago in Belgium, UNDA is renowned for manufacturing exceptional homeopathic products utilized in supporting immune, lymphatic and endocrine systems. In the production of all homeopathic remedies UNDA uses only pure materials and herbs that are biodynamically grown or wildcrafted. UNDA produces a broad range of homeopathic products in various potencies including: the unique Numbered Compounds, Gemmotherapy macerates, Schessler Tissue Salts, Gammadyn Oligo-Elements, Organotherapy, Plexes, creams and oils, as well as homeopathic compatible dental care.",
        "productname": "Seroyal USA - Muco coccinum 10t",
        "productprice": 55,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b71",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/069cd099-2dfd-48f2-a2aa-7ba2762d2be0_1.bf85264b16d63fe538b1939bf4f6bf23.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "KENSIE Eyeglasses CHARM Teal 47MM|Brand new authentic KENSIE Eyeglasses in color Teal. This Eyeglasses frame size is 47-16-130. This model is a, Female frame and comes with everything you would receive if you purchased it at a local retail store. Shop with confidence.",
        "productname": "KENSIE Eyeglasses CHARM Teal 47MM",
        "productprice": 83,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b72",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/7d5e862a-1f37-4d90-b261-ec64b1836fa4_1.fb83a627be9f4f0065ac40b52fa6927b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "Slippery Stuff Water-based Jelly, 8-oz tube|Easy to use tube with flip-top cap",
        "productname": "Slippery Stuff Water-based Jelly, 8-oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b73",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6a4361c4-d8c9-4693-a24d-0d9a5993dd90_1.3e361bef8e9390da16c45024b42f9d75.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "|Carrera 5032/COV Sunglasses CA5032COV-0ZT8-5218 - Green Frame, Lens Diameter 52mm, Distance Between Lenses 18mm",
        "productname": "Carrera 5032/COV Sunglasses CA5032COV-0ZT8-5218 - Green Frame, Lens Diameter 52mm, Distance",
        "productprice": 64,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b74",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/0efcba08-67c9-4197-96b9-3741254cad0b_1.057ce35469a0965f244f35e4d2a8bd0a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "CARRERA Eyeglasses 8813 0A1A Transparent Matte Blue 55MM|Brand new authentic CARRERA Eyeglasses in color 0A1A Transparent Matte Blue. This Eyeglasses frame size is 55-17-140. This model is a, Male frame and comes with everything you would receive if you purchased it at a local retail store. Shop with confidence.",
        "productname": "CARRERA Eyeglasses 8813 0A1A Transparent Matte Blue 55MM",
        "productprice": 92,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b75",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/a78ad248-da83-48d7-8565-ef7defc02fd4_1.a7489bedfc4499f1cc22edbf35a0310e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "Auralife is a full spectrum multi vitamin. It contains several minerals chelated to amino acids which promote absorption. Auralife contains a complex proprietary blend of digestion, liver toning and antioxidant promoting enzymes, herbs, and amino acids.|Empirical Labs, Auralife 120 caps",
        "productname": "Empirical Labs, Auralife 120 caps",
        "productprice": 90,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b76",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/57443845-0851-4c2b-8ece-9d7571150813_1.e511d7d5dac79c8b9eaf734ee9be2ef1.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "Sigvaris Advance Armsleeve 912AXRG77-PS 20-30 mmHg Advance Arm Sleeve With Gauntlet Plus; Beige; Extra Large and Regular|Sigvaris Advance armsleeves are woven from microfiber polyamide nylon which pulls moisture away from the skin to keep you comfortable year round. It is also very soft. To further protect your skin the fabric is infused with silver ions which are naturally anti-bacterial. What really sets this sleeve apart is the Sensinnov top-band. The Sensinnov band is used on Sigvaris premium thigh highs. Instead of dots or strips of silicone its one smooth sheet making it very skin friendly. Perfect for fragile or sensitive underarm skin. Sensinnov will keep your sleeve in place and wont roll. Sensinnov grip-top standard.Features. Compression - 20-30mmHg. Size - XR. Color - Beige",
        "productname": "Sigvaris Advance Armsleeve 912AXRG77-PS 20-30 mmHg Advance Arm Sleeve With Gauntlet Plus; Beige; Extra Large and Regular",
        "productprice": 75,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b77",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c67a34b8-0c32-474d-96d4-00d7143a841e_1.d77f31ab960255a9603fafe7c12702ba.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "|Features Ergo plus reacher basic hip kit Kit Includes 27&quot; Ergo Plus Reacher Sock Aid with Foam Handles (2) Pair Each Elastic Shoe Laces Black &amp; White 27&quot; Dressing Stick 24&quot; Stainless Steel Shoehorn &amp; Long Handle Bath Sponge Specifications Size: 27 in. - SKU: MDP13948",
        "productname": "Kinsman Enterprises KNE 37001 27 in. Ergo Plus Reacher Basic Hip Kit",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b78",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/8c3e3703-fded-45c2-bea3-30094bb52025_1.6dc745f46d3f484ce422bd09295a8e4f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "|Bandage Co-Flex 4&quot;X5Yds - 4&quot; X 5 Yard - 1 Roll / Each",
        "productname": "Bandage Co-Flex 4\"X5Yds - 4\" X 5 Yard - 1 Roll / Each",
        "productprice": 51,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b79",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f5cf7072-41c0-4c7d-a237-7be3e83d85c7_1.fc9d120b9f019b93295ba2d3e34ca466.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "KILTER Eyeglasses K5003 210 Brown 49MM|Brand new authentic KILTER Eyeglasses in color 210 Brown. This Eyeglasses frame size is 49-15-135. This model is a, Kids frame and comes with everything you would receive if you purchased it at a local retail store. Shop with confidence.",
        "productname": "KILTER Eyeglasses K5003 210 Brown 49MM",
        "productprice": 86,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b7a",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/07676cc3-de05-4246-95bc-e2075d2411d4_1.fbb96bcba0d2561e0623823da3688b26.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "SUPP TRUNK WALKER BLK SM D/S 1EA/CS DRIVE MED, Model CE 1080 S|Drive Medical Supp Trunk Walker Blk Sm, Each - Model CE 1080 S",
        "productname": "Drive Medical Supp Trunk Walker Blk Sm, Each - Model CE 1080 S",
        "productprice": 212,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b7b",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/1e526261-ca37-40b2-a204-b59041065430_1.73ff98d58d6311c5c77eca72a78a00d6.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "VERA WANG Eyeglasses EILONWY Lilac 52MM|Brand new authentic VERA WANG Eyeglasses in color Lilac. This Eyeglasses frame size is 52-00-140. This model is a, Female frame and comes with everything you would receive if you purchased it at a local retail store. Shop with confidence.",
        "productname": "VERA WANG Eyeglasses EILONWY Lilac 52MM",
        "productprice": 301,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b7c",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ed0d8635-4e0d-4dfb-87d2-73c54eac50c1_1.74ff589794a04cc06b57852b5234bb9b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "|Country of Origin: Ecuador - Latin Botanical Name: Alchornea Floribunda - Plant Parts Used: Bark - Take 1 capsule, 3 times daily, with meals. - TerraVita is an exclusive line of premium-quality, natural source products that use only the finest, purest and most potent ingredients found around the world. TerraVita is hallmarked by the highest possible standards of purity, potency, stability and freshness. All of our products are prepared with the high - Iporuru 4:1 - 450 mg (100 capsules, ZIN: 520567): Iporuru 4:1 - 450 mg",
        "productname": "Iporuru 4:1 - 450 mg (100 capsules, ZIN: 520567) - 3-Pack",
        "productprice": 91,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b7d",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6a560cc0-a210-4ba4-b8a2-6afe4691d629_1.90393d2c8f7d7ecbe81376c0f5095625.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Our soft mesh harnesses are conveniently made to slip over the dog's head and attach only once under the belly. There is a leash attachment on the back for walking. They contain a layer of padd- SKU: ZX9MR70-45MDPK",
        "productname": "Skull Crossbones Screen Print Soft Mesh Harness Pink Medium",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b7e",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/20f928db-1cc3-42c2-9e37-4ea08e49a2bf_1.76841d4ff814bc3ec67a57d5165f6b66.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage 62-26 XLCR Happy Meter Screen Printed Dog Pet Hoodie Cream - Size XL|A poly/cotton sleeved hoodie for cold weather days, double stitched in all the right places for comfort and durability!",
        "productname": "Mirage 62-26 XLCR Happy Meter Screen Printed Dog Pet Hoodie Cream - Size XL",
        "productprice": 61,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b7f",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b2968370-7654-42ff-87b6-0d2185821b37_1.1dda5c155b70e4bab807c7562e24b2b1.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|A poly/cotton sleeveless shirt for every day wear, double stitched in all the right places for comfort and durability! Product Summary : New Pet Products/British Flag Heart Screen Print S- SKU: ZX9MR51-137SMBBL",
        "productname": "British Flag Heart Screen Print Shirt Baby Blue Sm - 10",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b80",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ff235753-0ee4-403a-bb7c-393277ef37d2_1.1c0d1d3c285638fb6722093656e5aa8e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Reflective rope leash with stylish loop handle features strong and stylish plastic handle loop for comfort on the hand grip. Designed with our patented rope clip that is outstanding in design. There are reflective stitching throughout the rope that reflects the light for extra safety in darkness. Fitted with black polished, zinc alloy durable metal 360 swivel hook. Easy to snap on any dog collar or harness. Solid and vibrant colors are easy to see at all times. Our reflective rope dog leashes are a popular length 6'(180cm), and a good choice for walking most dogs. This leash works well for basic obedience training of puppies, and young dogs. Shorter traffic or control leads are also available. Features Reflective rope leash with stylish loop Heavy Duty polyester Rope webbing Multi-layer braided for higher tensile strength Reflective threads for safety &amp; visibility at night&lt;/ |Reflective rope leash with stylish loop handle features strong and stylish plastic handle loop for comfort on the hand grip. Designed with our patented rope clip that is outstanding in design. There are reflective stitching throughout the rope that reflects the light for extra safety in darkness. Fitted with black polished, zinc alloy durable metal 360 swivel hook. Easy to snap on any dog collar or harness. Solid and vibrant colors are easy to see at all times. Our reflective rope dog leashes are a popular length 6'(180cm), and a good choice for walking most dogs. This leash works well for basic obedience training of puppies, and young dogs. Shorter traffic or control leads are also available. Features Reflective rope leash with stylish loop Heavy Duty polyester Rope webbing Multi-layer braided for higher tensile strength Reflective threads for safety &amp; visibility at night Easy to click on and take off Durable plastic rope clip to ensure the quality and easy grip Vibrant colors are easy to see at any times Specifications Color: Blue Nylon Harness: DCSN202 Nylon Collars: DCSN002, DCS006 Length: 5/8&quot; x 72&quot; (13mm x 180cm) - SKU: DCPTL584",
        "productname": "Doco DCROPE2072-02L Reflective Rope Leash with Stylish Loop&#44; Blue - Large",
        "productprice": 66,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b81",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/47fb3683-9034-4b7e-a596-7d2c4631d649_1.03c3f0a303f11c8ba2e4bac5a0fe04bc.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage 500-070 TCLGXL Koi Fish Puppy Holdem Sling Tan w/Cheetah Lg/XL|Koi Fish Puppy Holdem Sling Tan w/Cheetah Lg/XL",
        "productname": "Mirage 500-070 TCLGXL Koi Fish Puppy Holdem Sling Tan w/Cheetah Lg/XL",
        "productprice": 72,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b82",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/3545a2b8-ab1a-4ff3-a6af-50a99635e0eb_1.e7db0273ebc072d527520cdf8f4bd5ca.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "mirage pet products feliz navidad screen print pet hoodies, medium, purple|We are a small, family-owned American workshop/factory that produces nearly 100,000 original products - fun pet apparel, strong dog and cat collars, cute pet toys, and more for everyone's favorite family members. Features Feliz Navidad Screen Print Pet Hoodies A poly/cotton sleeved hoodie for cold weather days, double stitched in all the right places for comfort and durability! Specifications Color: Purple Size: Medium - 12 - SKU: MRPP57769",
        "productname": "mirage 62-25-04 mdpr feliz navidad screen print pet hoodie purple m",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b83",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b7172ff0-a785-47c7-a986-f9f074d9f256.43bbe9d4e0690dc133e258de800b7a1b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "The Cool-Air Cot from Gen7Pets combines portable convenience, outdoor durability and pet-friendly comfort. It is ideal for raising your pet off muddy, bug infested, hot or wet surfaces. The Smart Air-Flow mesh provides cool air comfort and prevents pooling water after it rains which reduces the potential for itchy hotspots on pet's fur. The curved, raised back provides support and is ideal for dogs and cats that like to curl up for a nap. Quick snap-together design for storage and travel and has durable double stiching for extra strength. The powder-coated steel frame will not rust which allows the all-weather cot to be left outdoors.| Large Cool-Air Cot: The Cool-Air Cot from Gen7Pets combines portable convenience, outdoor durability, and pet-friendly comfort It is ideal for raising your pet off muddy, bug infested, hot, or wet surfaces The Smart Air-Flow mesh provides cool air comfort and prevents pooling water after it rains which reducest he potential for itchy hotspots on pet's fur The curved, raised back provides support and is ideal for dogs and cats that like to curl up for a nap Quick snap-together design for storage and travel and has durable double stiching for extra strength The powder-coated steel frame will not rust which allows the all weather cot to be left outdoors ",
        "productname": "Gen7Pets Cool-Air Cot Pet Bed, Large, Trailblazer Blue",
        "productprice": 87,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b84",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/9c2e1fc4-cfa8-4d66-9f28-75f36162ff7d.f97ae22a2ef3138d0e1eec589139bc90.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": " Posh pups will love the feel of this Solid Dog Polo in Ultra Violet! Embroidered logo on collar Button at neck for added room High cut stay dry belly 100% cotton Why We Love It: TheSolid Dog Polo by Doggie Design are a lightweight standard polo with logo on collar. Two functioning buttons for added room with tailored sleeves and high cut stay dry belly. Made of 100% cotton. Sure to be a favorite in your closet of pup cloths. Check out the other solid colors and striped designs sold separately. Sizing Information: X-Small: Chest 11&quot; Neck 9&quot;Small:Chest 13&quot; Neck 12&quot;Medium:Chest 16&quot; Neck 13&quot;Large:Chest 21&quot; Neck 16&quot;X-Large:Chest 23&quot; Neck 19&quot;XX-Large:Chest 28&quot; Neck 20&quot;3X-Large:Chest 32&quot; Neck 24&quot; |Posh pups will love the feel of this Solid Dog Polo in Ultra Violet! The Solid Dog Polo by Doggie Design are a lightweight standard polo with logo on collar. Two functioning buttons for added room with tailored sleeves and high cut stay dry belly. Made of 100% cotton. Sure to be a favorite in your closet of pup cloths. Features Solid Dog Polo Embroidered logo on collar Button at neck for added room High cut stay dry belly 100% cotton Specifications Color: Ultra Violet Size: 3XL Chest Size: 32&quot; Neck Size: 24&quot; - SKU: PTRTL27294",
        "productname": "Solid Dog Polo by Doggie Design - Ultra Violet - 3X-Large",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b85",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/97c120f7-6a57-4743-902f-3f40c047e46f_1.d2883b60f668ca61139be2e117ee5c4a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Plain Nylon Dog Collar XS Purple|Made in the USA. High qualtiy webbing made to military standards with heavy duty hardware.",
        "productname": "Plain Nylon Dog Collar XS Purple",
        "productprice": 55,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b86",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c33af9b4-d6cd-4fe5-984b-88dc43fcc91e_1.160245b64a6f071b5e509c1219095e14.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Puffy air mesh step-in harness features lightweight and durable high quality air mesh that provides a comfort fit, total control and style between your dog's chest. Ultra comfort designs using smoother webbing for the comfort of your buddy. Easy on and easy off, durable side release plastic buckle with adjustable tri-glide for custom fits. Heavy-duty stitching for lasting quality and fully welded metal d-o-ring for higher tensile pull force. Solid and vibrant colors are easy to see. Air mesh is breathable and light weight, keep your pet cool and ventilated and super soft and comfortable on dog's skin and fur. All of harnesses are designed to reduce stress, allowing weight to be distributed evenly through the chest and shoulders when your buddy during walks. Features Puffy air mesh step-in harness leash 100% high quality nylon Hi-Density quality air mesh fabric |Puffy air mesh step-in harness features lightweight and durable high quality air mesh that provides a comfort fit, total control and style between your dog's chest. Ultra comfort designs using smoother webbing for the comfort of your buddy. Easy on and easy off, durable side release plastic buckle with adjustable tri-glide for custom fits. Heavy-duty stitching for lasting quality and fully welded metal d-o-ring for higher tensile pull force. Solid and vibrant colors are easy to see. Air mesh is breathable and light weight, keep your pet cool and ventilated and super soft and comfortable on dog's skin and fur. All of harnesses are designed to reduce stress, allowing weight to be distributed evenly through the chest and shoulders when your buddy during walks. Features Puffy air mesh step-in harness leash 100% high quality nylon Hi-Density quality air mesh fabric Breathable air mesh for comfort and soft feel on dog's skin Dual Layered for higher tensile strength with strong back webbing Heavy duty metal accessories Durable plastic buckle on the top for easy on and easy off Puffy padded feel for dog's comfort Vibrant colors are easy to see at any time of the day Specifications Color: Rasperry Pink Puff Mesh Leash: DCA1150, DCA1160, DCA1348 Extra Small: .375 x 13-17&quot; Small: .625 x 18-25&quot; Medium: .75 x 21-30&quot; Large: 1 x 26-39&quot; Extra Large: 1.5 x 30-46&quot; - SKU: DCPTL207",
        "productname": "Doco DCA201-18XL Puffy Air Mesh Step-In Harness Leash&#44; Raspberry Pink - Extra Large",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b87",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f5a02d48-030d-447c-8bb6-6fb0eb689f44.0f68ddfa101c10ff53883471d348e3a1.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Kaytee Squirrel and Critter Blend is a mix of quality grains and seeds designed to attract squirrels, chipmunks and other backyard critters and provides an alternative to help keep them satisfied and away from bird feeders. SKU:ADIB0002DKB3G|Kaytee&reg; Squirrel and Critter Blend is a mix of quality grains and seeds designed to attract squirrels, chipmunks and other backyard critters and provides an alternative to help keep them satisfied and away from bird feeders.20 lbsContains healthful corn, seeds and nutsDesigned to attract squirrels, chipmunks and other backyard crittersProvides an alternative to help keep them satisfied and away from bird feeders.Poly barrier bag.Feeding InstructionsKeep feeders filled with fresh food.Discard old food before refilling and clean feeders regularly to minimize mold and bacteria.This product is only intended for feeding wild birds.Guaranteed AnalysisCrude Protein (min.) 8.0%Crude Fat (min.) 10.0%Crude Fiber (max.) 9.0%Moisture (max.) 12.0%IngredientsCorn, Oil Sunflower, Whole Peanuts, Striped Sunflower, Artificial Apple Flavor.Storage InstructionsReseal package and store in a cool dry place, preferably in a sealed container. This will protect against insect infestation that can naturally occur with any whole grain seed product.",
        "productname": "Kaytee Squirrel and Critter Blend, 20-Pound",
        "productprice": 66,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b88",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/748b8782-fd81-49db-b634-504f53afe58c_1.99cc20e9b3b74634c8e96c2e88c203dd.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Kaytee Forti-Diet Pro Health 100502100 Seed-Based Blend Parakeet Bird Food, 5 lb|KAYTEE Forti-Diet Pro Health is a Seed-Based Blend of Fresh, Palatable Seeds, Grains and Fortified Supplements that provides the essential nutrients your pet needs for a long, healthy life. With DHA OMEGA-3 - Supports Heart, Brain &amp; Visual Functions Rich in Natural Antioxidants - For general health and immune support Probiotics &amp; Prebiotics -Natural ingredients that aid in digestive health Naturally Preserved - For ideal freshness Enhances feathers and coloring. Features: Conversion instructions: When introducing a new food, begin with a mixture of &quot;old and new&quot; food. Gradually increase the amount of new food over a 7 to 10 day period. For best results, discard any uneaten portion and clean food dish before next feeding. Fresh water should be available at all times. The following feeding amounts can be used as a starting point for one bird. Adjust the portions to maintain proper weight and if additional birds are fed ",
        "productname": "Kaytee Forti-Diet Pro Health 100502100 Seed-Based Blend Parakeet Bird Food, 5 lb",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b89",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/49386a9e-6718-420e-9f27-65c68fca05c5_1.be17158137cd0b47a5d7d5d4de50e239.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Peppermint Widget Genuine Leather Dog Collar Red 10Product Summary : New!/Christmas 2017/Holiday Collars/Peppermint Widget Leather Dog Collars@Christmas/Christmas Dog Collars/Peppermint Widget Leather Dog Collars@Collars and Leashes/Widget Collar Collection/Peppermint Widget Leather Dog Collars|Peppermint Widget Genuine Leather Dog Collar Red 10 Product Summary : New!/Christmas 2017/Holiday Collars/Peppermint Widget Leather Dog Collars@Christmas/Christmas Dog Collars/Peppermint Widget Leather Dog Collars@Collars and Leashes/Widget Collar Collection/Peppermint Widget Leather Dog Collars",
        "productname": "Peppermint Widget Genuine Leather Dog Collar Red 10",
        "productprice": 51,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b8a",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/7f02d249-5d2e-4cb4-ae00-32d4fdeefbb2_1.440c4f34a89e6dccd49d3e6667593332.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Bone Shaped American Flag Screen Print Shirts White XXL (18) Product Summary : Dog Shirts/Screen Print Shirts/Bone Shaped American Flag Screen Print Shirts- SKU: ZX9MR51-08-XXLWT",
        "productname": "Bone Shaped American Flag Screen Print Shirts White XXL - 18",
        "productprice": 99,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b8b",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ab534cc8-3562-4320-84e6-a38998de1934_1.2e51dbd31e6023a8439bc9fe51913b6a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage Pet Products 20-Inch Adopt Me Rhinestone Print Shirt for Pets, 3X-Larg...|Adopt Me Rhinestone Shirt Brown XXXL (20)",
        "productname": "Adopt Me Rhinestone Shirt Brown XXXL (20)",
        "productprice": 88,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b8c",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6e6bcfa7-e51b-48c2-bb9c-a52e9ef3888e_1.99cd5dbc1058f93c25b02447560f44ff.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage 622-27 XS-RD Candy Cane Princess Knit Pet Sweater XS Red|Candy Cane Princess Knit Pet Sweater XS Red",
        "productname": "Mirage 622-27 XS-RD Candy Cane Princess Knit Pet Sweater XS Red",
        "productprice": 56,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b8d",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/15a4e0a6-e1e7-4c85-8f01-be336ac40620_1.061c0d736ea04fdb2c23cd9584bb07cd.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "DetailsOriginal Mane 'n Tail ShampooExclusive original formula containing high lathering, cleansing agents fortified with moisturizers and emollients.Our micro-enriched protein formula provides down to the skin cleansing action and conditioning, leaving the hair soft and shiny.Made and distributed in the USA.DirectionsHuman Use:The amount used will vary depending on the volume and length of hair.Apply the original Mane 'n Tail Shampoo.Work through hair with fingertips, rinse thoroughly and follow with an application of conditioner.For animal Use:Pre-wet the coat with clear water to remove excessive, loose dirt.Add a liberal amount of Mane 'n Tail Shampoo into a bucket of water.Apply shampoo solution with a sponge and massage until a rich lather appears.Allow lather to remain on the hair for several minutes.Rinse until water runs clear.Towel dry.For Best Results:After shampooing, an application of conditioner is recommended.Keep out of eyes and mucous membranes.Keep product from freezing.|Mane 'n Tail and Body Shampoo, 32 Ounce (Pack of 3)",
        "productname": "Mane 'n Tail and Body Shampoo, 32 Ounce (Pack of 3)",
        "productprice": 77,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b8e",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ba99eb01-d34a-4e76-8ff6-fe2870091280_1.7ffd7b5e971459a630c2d77dc5a0106d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "This is an awesome leather luggage tag that will set your luggage apart in style. The tag is made of black leather and the design shown is printed on one side with special inks. A card for your address information (included) slips inside and is protected by a clear vinyl window. The tag is approximately 2.75&quot; (7.0 centimeters) x 4.5&quot; (3.8 centimeters) in size. A leather strap is also included.| Pug Dog Pet Leather Luggage ID Tag Suitcase Carry-On: Leather tag is approximately 2.75&quot; (7.0cm) x 4.5&quot; (3.8cm) Design shown is printed on one side of tag Address card is protected behind clear vinyl window Includes leather strap Sold individually ",
        "productname": "Pug Dog Pet Leather Luggage ID Tag Suitcase Carry-On",
        "productprice": 58,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b8f",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/42ac8076-d864-4d67-a75c-7175f382bca8.9a79901cffde5e7d85d99add63bc6f1c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Holly N Jolly Screen Print Soft Mesh Harness Pink Extra Large",
        "productname": "Holly N Jolly Screen Print Soft Mesh Harness Pink Extra Large",
        "productprice": 71,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b90",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c8392111-4204-4337-b4c4-910b4741ff15_1.c5e72cfcc7e40eb1435aea7325cc96da.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Ideal for fetching, tossing and gnawing, this Woven Figure Eight Dog Rope Toy features a strong, densely woven rope in a twisted shape with a plastic reinforcement in the middle to handle even the toughest dogs. Comes in assorted colors. Measures approximately 12.5&quot; long x 4.75&quot; wide at widest point. Comes packaged to a hanging panel.|Being in the dollar merchandise business since its beginning, we know what sells, and we are always adding new and different items to our inventory. We are always looking for new items, and we have recently added pet items and craft supplies to our catalog. We design all of the packaging for our items to ensure that categories of merchandise have cohesive matching packaging, and that they are appealing to the eye. Features Woven Figure Eight Dog Rope Toy, 12 Piece Ideal for fetching, tossing and gnawing, this Woven Figure Eight Dog Rope Toy features a strong, densely woven rope in a twisted shape with a plastic reinforcement in the middle to handle even the toughest dogs Comes in assorted colors - SKU: KOLIM75785",
        "productname": "Woven Figure Eight Dog Rope Toy",
        "productprice": 67,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b91",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/cb209b36-09dd-40b1-8205-f93eafa17891_1.dc3137cdd627295fe8389d2c33618d7e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Features: -Center-to-center: 24''. -Brass construction. -Classic Traditional collection. Material: -Metal. Dimensions: -2.13'' D. Overall Height - Top to Bottom: -3&quot;. Overall Product Weight: -3.55 lbs. Bars Plumbing Antique Barcelona Brass Bronze Chocolate Chrome English Matte Nickel Polished Satin Amber Black Gold Metal White holidays, christmas gift gifts for girls boys|QAL1320 Features Center-to-center: 24'' Brass construction Classic Traditional collection Material: Metal Dimensions 2.13'' D Overall Height - Top to Bottom: 3&quot; Overall Product Weight: 3.55 lbs ",
        "productname": "Alno Inc Classic Traditional 24'' Grab Bar",
        "productprice": 183,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b92",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/21ea2806-148d-44c7-9e38-49b66c02caba_1.c10492650ce5e765cf71473ce460a94d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "These Classical Easel tabletop cardholders come in 5 sizes to fit your needs. Made out of clear acrylic to display your specials, menus, and much more.|Classic Easel Design;",
        "productname": "5W x 1D x 7H Classic Easel Tabetop Card Holder, case of 12",
        "productprice": 110,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b93",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/5f7539eb-5ae7-4123-bd98-dd66076e0c47_1.765e19801104f09f412dd1f821ed79c5.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage 52-76 XXLAQ Stuck Up Pup Rhinestone Dog Shirt Aqua 2XL|Stuck Up Pup Rhinestone Shirts Aqua XXL (18)Country of Origin: &nbsp;USA and/or Imported",
        "productname": "Stuck Up Pup Rhinestone Shirts Aqua XXL (18)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b94",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/73ab7f52-4330-4071-81dd-c52f37127cfb_1.25baf5effbeed86c2bd774d499ff2795.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|We have created an exciting line of dog fashion that is fun and modern with the certainties of comfort, luxury and affordability. We assure you the best in style, design, and quality. We hope you have as much fun and excitement with us as we have. Features Jake Raincoat Sleek raincoat with easy to clean Polyester and D ring Cloth hook and eye closures Cotton lining 50% Polyester, 50% Cotton Specifications Color: Brown Size: Extra Small - SKU: PCHTF718",
        "productname": "Pooch Outfitters PJRC-XS Jake Raincoat&#44; Brown - Extra Small",
        "productprice": 90,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b95",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e791ef3f-c5bf-467c-83ab-e7f3e9691c2a_1.14610643d5b468321745e0802a41b621.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "GENESIS Eyeglasses G5014 604 Burgundy 52MM|Brand new authentic GENESIS Eyeglasses in color 604 Burgundy. This Eyeglasses frame size is 52-17-135. This model is a, Female frame and comes with everything you would receive if you purchased it at a local retail store. Shop with confidence.",
        "productname": "GENESIS Eyeglasses G5014 604 Burgundy 52MM",
        "productprice": 83,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b96",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/38d255b7-4600-4202-a9f0-a8166354f537_1.b58c6afd0d522b75d88fbca2b304f4e7.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Monarch M-initial keychain h-(Pk/2)|Monarch M-Initial Keychain H - Pack of 2 Take a look at our products, where you can browse through our collection of unique gadgets and gifts. Flip through the widest assortment of products and choose the best one for you. Specifications Weight: 0.1 lbs - SKU: ANCRD2182126",
        "productname": "Monarch M-initial keychain h-(Pk/2)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b97",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/fd350870-35f2-42dc-8d05-b4312192e976_1.351344ccacbb3dd1a1d798dc79dbd079.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Beautifully packed for an amazing thinking of you presentation. Gift Basket Includes: Skittles 2.17oz,Froot Roll .75oz, Chex Mex 1.75oz, Reeses 1.5oz, Nature Valley Peanut Bar 1.49oz, Cheez-it 1.5oz, Gushers 0.9oz, KitKat 1.5oz,Chips OHoy 1.4oz, Ritz Bites 1.0oz, Hersheys 1.55oz, Mini Oero 1.0oz, York Pattie .48oz, Trail Mix 1.5oz, Rice Kripsy Treats 1.3oz, Zoo Animal Cookies 1.0oz, GoldFish .75ozStunning package sure to put a smile on the face of the recepient. Packed in a gift box as shown with an 8inch Plush. Finished with a stunning bow!|Beautifully packed for an amazing thinking of you presentation. Gift Basket Includes: Skittles 2.17oz,Fruit Roll .75oz, Chex Mex 1.75oz, Reeses 1.5oz, Nature Valley Peanut Bar 1.49oz, Cheez-it 1.5oz, Gushers 0.9oz, Kit Kat 1.5oz,Chips AHoy 1.4oz, Ritz Bites 1.0oz, Hersheys 1.55oz, Mini Oero 1.0oz, York Pattie .48oz, Trail Mix 1.5oz, Rice Kripsy Treats 1.3oz, Zoo Animal Cookies 1.0oz, GoldFish .75oz. Stunning package sure to put a smile on the face of the recepient. Packed in a gift box as shown with an 8inch Plush. Finished with a stunning bow!",
        "productname": "CakeSupplyShop Item#004BSG Happy 4th Birthday Rainbow Thinking Of You Cookies, Candy & More Care Package Snack Gift Box Bundle Set - Ships FAST!",
        "productprice": 55,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b98",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/5a0d4fb2-cb7f-4885-8ca3-bc55ab3bde2e_1.3506dc56c1a301ee1a93953b546ff7fe.gif?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|",
        "productname": "POLO RED by Ralph Lauren",
        "productprice": 117,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b99",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/db1df7a3-47ce-4eff-9cfd-e646ab7d2f66_1.81040bba6b841f5387d74e5b22500ffc.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Five Leonard Mountain's Gourmet Soups in a gift box. Perfect for any gift giving occasion or to keep in your pantry. The soup is so easy to prepare, just add water and let it cook for about 20 minutes. You can toss in your favorite meat. If you are vegetarian, then this is perfectly seasoned just as it is.|Leonard Mountain Motor Home Survival Kit Gourmet Soup Mixes: Hunky Chunky Veggie Stew, Spuds 'n Chives Potato, Chicken 'n Pasta, 4 Amigos Tortilla Soup, 3 Amigos Enchilada Stew Ready in 20 minutes--just add water Low sodium Low fat ",
        "productname": "Leonard Mountain Motor Home Survival Kit Gourmet Soup Mixes, 6 oz, 5 count",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b9a",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/457c9770-65e2-45a1-b689-6024cf691c4c_1.46137798a8d567c1140d7bee509c9b8b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Dd collar (double d-ring) has two fully welded black color finished d-rings for added security and strength. This 2 d-ring collars design is to alleviate the pressure from the quick release buckle. Allowing this collar to have maximum pull strength. The high quality nylon provides a comfort fit between your dogs neck and collar. Id ring for attaching your pets identification. Feel safe and secure with the collar. Perfect for bigger breed and when you handling a strong dog. Features Double d-ring dog neck collar 100% high quality nylon Higher tensile strength Nylon is resistance to mildew, aging and abrasion Quick &amp; easy release plastic buckle Tri-glide for easy Heavy duty D-Ring for leash and ID tag Vibrant colors are easy to see at all times Specifications Color: Olive Green Nylon Dog Leash: |Dd collar (double d-ring) has two fully welded black color finished d-rings for added security and strength. This 2 d-ring collars design is to alleviate the pressure from the quick release buckle. Allowing this collar to have maximum pull strength. The high quality nylon provides a comfort fit between your dogs neck and collar. Id ring for attaching your pets identification. Feel safe and secure with the collar. Perfect for bigger breed and when you handling a strong dog. Features Double d-ring dog neck collar 100% high quality nylon Higher tensile strength Nylon is resistance to mildew, aging and abrasion Quick &amp; easy release plastic buckle Tri-glide for easy Heavy duty D-Ring for leash and ID tag Vibrant colors are easy to see at all times Specifications Color: Olive Green Nylon Dog Leash: DCS1048, DCS1072, DCS2048, DCS1148, DCS1172 Medium: .75 x 14-20&quot; Large: 1 x 18-27&quot; Extra Large: 1.5 x 20-30&quot; - SKU: DCPTL219",
        "productname": "Doco DCS005-10XL Double D-Ring Dog Neck Collar&#44; Olive Green - Extra Large",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b9b",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/17c3125e-384a-4806-b433-767377af078f_1.fd07109c9dd648f5cd9b66614af0fc85.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "From easy-going, casual get-togethers to sophisticated, elegant eves, we have the decorative touches to make every party memorable. The details make the difference, and we?ve cornered the market on creativity, with decorative accents to create a unique ambiance for any function.|Party Creations Hot/Cold Cups, 9 Oz, Pastel Blue, 8 Ct",
        "productname": "Party Creations Hot/Cold Cups, 9 Oz, Pastel Blue, 8 Ct",
        "productprice": 77,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b9c",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/bd5ef4f1-db0f-4525-b3ad-11c737029642_1.85aec5e045f54740d33759099f2d0666.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Studded Dragon Hoodies Pink XXL (18) Product Summary : Dog Hoodies/Rhinestone Hoodies/Studded Dragon Hoodies- SKU: ZX9MR54-26-XXLPK",
        "productname": "Studded Dragon Hoodies Pink XXL - 18",
        "productprice": 66,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b9d",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/719e92ae-50f4-40ab-8596-ae395e5b89f7_1.7a0e1e5701d4062de618d6909596df37.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Our soft mesh harnesses are conveniently made to slip over the dog's head and attach only once under the belly. There is a leash attachment on the back for walking. They contain a layer of padd- SKU: ZX9MR70-45MDBL",
        "productname": "Skull Crossbones Screen Print Soft Mesh Harness Blue Medium",
        "productprice": 75,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b9e",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/9adb1983-81a5-4b1a-9128-82e36cd65f82.66b53d1c15afdfc2c43fbbe8081e8ae4.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage 52-28 XXLBBL Evil Rhinestone Dog Shirt Baby Blue 2XL|A poly/cotton sleeveless shirt for every day wear, double stitched in all the right places for comfort and durability!",
        "productname": "Mirage 52-28 XXLBBL Evil Rhinestone Dog Shirt Baby Blue 2XL",
        "productprice": 73,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498b9f",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/d154ad81-f10b-48ac-ab01-a741b4e30941_1.43978c920b3b51ddf19a631fc0cc7391.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Size: 1&quot; Wall, 2&quot; Base|Orange Standard Size Cupcake Liners - 100 Count - National Cake Supply",
        "productname": "Orange Standard Size Cupcake Liners - 100 Count - National Cake Supply",
        "productprice": 77,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba0",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6c04b829-c0f0-4706-bc6c-d4ea3131776e_1.046a6b667c18fd5174c66ea0179bb1e8.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Personalized Name Denim &amp; Brown Pacifier Clip The ultimate in glamour and glitz! This just makes you smile! Perfect for a little man! Original and affordable, that would make this a perfect baby gift. These Pacifiers are hand decorated in Brooklyn NY espe|Personalized Name Denim Brown Pacifier Clip The ultimate in glamour and glitz! This just makes you smile! Perfect for a little man! Original and affordable, that would make this a perfect baby gift. These Pacifiers are hand decorated in Brooklyn NY especi",
        "productname": "Personalized Name Denim & Brown Pacifier",
        "productprice": 87,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba1",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/598299b3-2f83-4e99-a2af-c35592c78c79.20060d2e4ed1fd2be6e2ea3895b5ed9f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "This closed toe, thigh high hybrid garment maintains more graduated compression throughout the leg than traditional stockings. The Secure line provides containment and compression to manage venous edema, lymphedema, post-surgical edema, and general edema. High modulus in-lay yarns work to maintain a limb profile and minimizes garment fatigue. Features 30-40 mmHg firm compression Maintains more graduated compression compared to traditional stockings Unique sizing system fits regular and full sizes - up to 40-inch thighs Opaque colors conceal skin blemishes discreetly Durable, comfortable, and breathable Indications Ideal for patients with chronic venous insufficiency (CVI) Lymphedema Lipodema Recurrent venous ulcers Deep vein thrombosis (DVT) Superficial phlebitis Post-thrombotic syndrome Severe varicosities Orthostatic hypotension and post-phlebitic syndrome|Sigvaris Secure 553 Women's Closed Toe Thigh Highs w/Silicone Band - 30-40 mmHg",
        "productname": "Sigvaris Secure 553 Women's Closed Toe Thigh Highs w/Silicone Band - 30-40 mmHg",
        "productprice": 105,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba2",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ad051c3f-32cf-437a-a9fa-878d29d255ea_1.1f5772bcf8e05e36e4bce3420b983110.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Birthday Girl Rhinestone Shirt Red XS (8)",
        "productname": "Birthday Girl Rhinestone Shirt Red XS (8)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba3",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/58bb5049-ecbf-48ac-8ed8-aecd5d89bb7e.ec56fdc80f4ced4bfffc4b58dd7af1b7.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": " MFG# ULC-2-DP ULC2DP UPC# 733572049459 |T H Marine Nav Light Storage Clips 1 Pair ULC-2-DPCountry of Origin: &nbsp;USA or Imported",
        "productname": "T H Marine Nav Light Storage Clips 1 Pair ULC-2-DP",
        "productprice": 54,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba4",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/61ae47ff-fb50-48d8-9450-68eac81056c3_1.b481aa066fe3a53e9bc5f43ff17323e2.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Its A Skin-made in the USA using high quality vinyl. Super rich colors with a matte lamination provide a great look and added protection against minor scratches. Leaves no sticky residue behind.|Made in the U.S.A. | 30-day Money back Guarantee | 100% Satisfaction Guaranteed with every order | Extremely Fast Shipping | Highest Quality Skins on the market today",
        "productname": "Skin Decal For Beats By Dr. Dre Beats Pill Plus / Red Pink Chevron",
        "productprice": 61,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba5",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6a565a7a-57c9-4460-93e2-a586911b8f76_1.9119561487ccd81ba934c267b785955c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Size: 6-3/4&quot; x 2-5/8&quot; x 3/4&quot;. Rectangle Box. 2 Piece Set. Retractable. Ballpoint. Writing Instrument. Pocket Clip. Rollerball. Color(s): Black/Gold. Imprint Method: Screen printed or Engraved.- SKU: ARPN461",
        "productname": "Aeropen International PWD-1001 Black Brass Ballpoint and Rollerball Pen with Double Pen Gift Box",
        "productprice": 66,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba6",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/7a975ca3-56e9-428d-9dda-f8e0addafc18_1.fb81c2cc3536b978f88e4bcd1eab5267.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Hydrates all day for younger-looking skin; Almay line smoothing makeup counteracts moisture loss, a key cause of fine lines; Infused with replenishing hydrators and refreshing cucumber; Hydrates all day for younger-looking skin; Almay line smoothing makeup counteracts moisture loss, a key cause of fine lines; Infused with replenishing hydrators and refreshing cucumber|ALMAY LINE SMOOTH LIQ MU (L) (Pack of 1 Only)",
        "productname": "Almay Line Smoothing Makeup SPF 15 160 Naked",
        "productprice": 62,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba7",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c3f5bd77-7443-4041-a92e-74a3ba004ff5.004c0e9c9d44718ab1f7220ae99dd826.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage Pet Products Heart Leather Emerald Dog Collar, 14&quot;|Heart Leather Emerald Green 14",
        "productname": "Heart Leather Emerald Green 14",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba8",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/311b9d63-d245-4d44-8240-0c2537743572_1.5bc2b52f55e56e8fb730edeaf72c2952.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Smart Blonde is the leading manufacturer of License Plates and Signs. We also offer a distinctive variety of Key chains, magnets and other accessories. Each and every product is made of highest quality aluminium which has resistance to weather, heat and corrosion. Our imperishable products are lightweight and portable. We offer an extensive variety of collection which ranges from classic shades to vibrant ones. Features.|Smart Blonde is the leading manufacturer of License Plates and Signs We also offer a distinctive variety of Key chains, magnets and other accessories Each and every product is made of highest quality aluminium which has resistance to weather, heat and corrosion Our imperishable products are lightweight and portable We offer an extensive variety of collection which ranges from classic shades to vibrant ones Features- Yuma Arizona Background Novelty Metal Key Chain- high gloss metal key chain- Made of the highest quality aluminum for a weather resistant finish- It is lightweight durable- Predrilled with hole and includes keyring- Proudly made in the USASpecifications- Size 15 x 3 in - Dimension 15'' H x 3'' W x 005'' D SKU: SMRTB15127",
        "productname": "Smart Blonde KC-8649 1. 5 x 3 inch Yuma Arizona Background Novelty Metal Key Chain",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498ba9",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4cecdc29-069c-425a-b607-55fb3b42d118_1.4c7a241f1277b62c55c03eb6c8397aca.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|To prepare healthy and tasty food, you need proper kitchenware. Apart from comprising utensils needed to prepare and serve meals, Kitchenware is also required to store dry food, or even left overs. Now maintain your kitchen in an organized manner with the array of kitchenware. Fill your kitchen with the aroma of delicious foods cooked with ease using one of the quality kitchen utensils from us. Features Food Container - Combo 250 Specifications Color: White Material Type: PAPER Dimensions: 12Z - SKU: SSN5578",
        "productname": "PCT D12RBLD Food Container - Combo 250",
        "productprice": 56,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498baa",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/cf8343fd-ea2d-4635-ba32-ea7d3c789c08_1.6a48bce107683cdd3276761661201b30.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Modern Dandelion Design Stationery - 8.5 x 11-60 Letterhead Sheets - Contempary Letterhead (Modern) Fun modern look stationery to use for letters, invitations or any creative idea that comes to mind. Make your letters stand out with this fun letterhead paper. .Stationery measures 8.5 x 11 inches each and have 60 sheets per packCompatible with both Inkjet and Laser printers60# Husky offset paper |Modern Dandelion Design Stationery - 8.5 x 11-60 Letterhead Sheets - Contempary Letterhead (Modern) - B6503",
        "productname": "Modern Dandelion Design Stationery - 8.5 x 11-60 Letterhead Sheets - Contempary Letterhead (Modern) - B6503",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bab",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/5200e982-4bd5-41b7-b957-4063b7332e1e_1.25fb2ffa972b1f45ea85715ddd8f072b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Our soft mesh harnesses are conveniently made to slip over the dog's head and attach only once under the belly.There is a leash attachment on the back for walking.They contain a layer of padding on the chest for extra comfort while walking.Product Summary : Holiday Pet Products/Christmas and Hannukah/Holiday Harnesses/Presents Screen Print Soft Mesh Harness|Our soft mesh harnesses are conveniently made to slip over the dog's head and attach only once under the belly.There is a leash attachment on the back for walking.They contain a layer of padding on the chest for extra comfort while walking. Product Summary : Holiday Pet Products/Christmas and Hannukah/Holiday Harnesses/Presents Screen Print Soft Mesh Harness",
        "productname": "Presents Screen Print Soft Mesh Harness Blue Extra Large",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bac",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/48dfdeed-465c-43fa-80ae-746a93e17675_1.f07d613a26588a2da4de8a0eb246338e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Country of Origin: Ecuador - Latin Botanical Name: Citrus Aurantifolia - Plant Parts Used: Fruit - Apply Bianca Rosa salve morning and evenings, or as directed by a healthcare practitioner. On a moist cotton wool pad or with the fingertips, apply to the desired area of the body. Massage onto thoroughly cleansed skin with a gentle circular motion. - TerraVita is an exclusive line of premium-quality, natural source products that use only the finest, p - Lime Fruit 4:1 Salve (2 oz, ZIN: 520711): Lime Fruit 4:1 Salve",
        "productname": "Lime Fruit 4:1 Salve (2 oz, ZIN: 520711)",
        "productprice": 60,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bad",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f00259fa-cdab-400e-b427-641bb4b12038_1.58dee2b2bcf176b5c13d865154f047bd.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Discover the secret to a complete eye look in one easy sweep with studio secrets professional the one sweep eye shadow. The unique applicator is designed to fit your eye shape to define, color and highlight your eyes in one easy sweep. The beautifully coordinated shadows come in natural, playful or smoky palettes expertly designed to enhance your eye color. Discover your stunning eye look!|The one sweep shadow is a breakthrough new way for anyone to get a professional eye shadow look. The unique applicator is shaped to fit the eye and apply three shades in one step to define, color and highlight. It's fast, easy, and mistake-proof.",
        "productname": "**DISCONTINUED**L'Oreal Studio Secrets Professional One Sweep Eye Shadow",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bae",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e1f9a34b-ce2e-4de0-b544-ca20315b7ff2.a8fb8a83c50388a5274a20ef1c88fe7a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Snowflake Rhinestone Shirt Aqua M (12) Product Summary : Dog Shirts/Rhinestone Shirts/Snowflake Rhinestone Shirt- SKU: ZX9MR52-25-13-MDAQ",
        "productname": "Snowflake Rhinestone Shirt Aqua M - 12",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498baf",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/45c3c668-9884-4b52-aa70-def3cd6b8563_1.7f45b8eb28166981f44c3fa9981a63d7.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "With a velvety, non-sticky texture Boasts a water-resistant formula that ensures long wearing Offers reflecting pearl colors that revives lipstick color Adds an iridescent shimmer to lips Contains Jojoba Oil to nourish &amp; soften lips Blended with natural antioxidant Vitamin E to lessen skin damage &amp; aging Features a Soft Touch Gliding Applicator that gives a quick application Can be worn alone or over your favorite lip color| With a velvety non-sticky texture. Boasts a water-resistant formula that ensures long wearing. Offers reflecting pearl colors that revives lipstick color. Adds an iridescent shimmer to lips. Contains Jojoba Oil to nourish &amp; soften lips. Blended with natural antioxidant Vitamin E to lessen skin damage &amp; aging. Features a Soft Touch Gliding Applicator that gives a quick application. Can be worn alone or over your favorite lip color. ",
        "productname": "Too Faced Sparkling Glomour Gloss - Pink Bling 3.8ml/0.128oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb0",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b4f16078-6dfc-4b15-9fa6-0cf5f2e9213e_1.9f2c3fe7da88f0591ff83ce5d77fe10e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|A gentle oriental floral with notes of frangipani, apricot, honeysuckle, orchid, lotus, sandalwood, vanilla, and musk. Created in 2009.",
        "productname": "Siren Eau-de-parfume Spray Women by Paris Hilton, 1 Ounce",
        "productprice": 68,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb1",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ad5800f1-e83f-49fd-ae8e-3162b6d61c14_1.8e86edfed1748338ad267180cad7d294.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Sony 357/303 - SR44W/SR44SW Silver Oxide Button Battery 1.55V - 100 Pack + 30% Off Sony 357/303 - SR44W/SR44SW Silver Oxide Button Battery 1.55V *100 Batteries* This battery is used in the following items: Watches, computer motherboards, calculators, PDAs, electronic organizers, garage door openers, toys, games, door chimes, pet collars, LED lights, sporting goods, pedometers, calorie counters, stopwatches and medical devices. Cross Reference: SR44, 157, 103, A76, G13, L1154, LR1154, 357, 303, GP76, SR1154 SR44SW, SR44W Product Eligible for FREE SHIPPING! Free Shipping Offer Applicable for items shipped to US Addresses ONLY|Sony 357/303 - SR44W/SR44SW Silver Oxide Button Battery 1.55V - 100 Pack + 30% Off!",
        "productname": "Sony 357/303 - SR44W/SR44SW Silver Oxide Button Battery 1.55V - 100 Pack + 30% Off!",
        "productprice": 199,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb2",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e1d09d9a-8fd0-4ffd-aec1-70e91b57c821_1.7cfa36de6cd241a67426708728c4078f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Features: -Frame of bend-resistant, powder-coated, 18 ga. cold-formed steel. -Legs are made of high impact polypropylene plastic. -Cover is made of the extremely durable fabric Texron; a non-sag, open weave, vinyl covered polyester yarn. -Lace-up cover can be tightened periodically if necessary. -Cots are stackable. -No screws, nuts or other small parts. Bed Material: -Polyester. Elevated: -Yes. Country of Manufacture: -United States. Dimensions: Overall Height - Top to Bottom: -5&quot;. Size Extra Large - 52&quot; L x 22&quot; W - Overall Depth - Front to Back: -52&quot;. Size Extra Large - 52&quot; L x 22&quot; W - Overall Width - Side to Side: -22&quot;. Size Extra Large - 52&quot; L x 22&quot; W - Overall Product Weight: -8 lbs. Size Extra Long - 52&quot; L x 30&quot; W - Overall Width - Side to Side: -30&quot;. Size Large - 40&quot; L x 30&quot; W - Overall Depth - Front to Back: -40&quot;. Size Large - 40&quot; L x 30&quot; W - Overall Product Weight: -7 lbs. Size Small - 30&quot; L x 22&quot; W - Overall Product Weight: -6 lbs. Size Small - 30&quot; L x 22&quot; W|ZF1280 Features Frame of bend-resistant, powder-coated, 18 ga. cold-formed steel Legs are made of high impact polypropylene plastic Cover is made of the extremely durable fabric Texron; a non-sag, open weave, vinyl covered polyester yarn Lace-up cover can be tightened periodically if necessary Cots are stackable No screws, nuts or other small parts Bed Material: Polyester Elevated: Yes Country of Manufacture: United States Dimensions Overall Height - Top to Bottom: 5&quot; Size Extra Large - 52&quot; L x 22&quot; W Overall Depth - Front to Back: 52&quot; Overall Width - Side to Side: 22&quot; Overall Product Weight: 8 lbs Size Extra Long - 52&quot; L x 30&quot; W Overall Width - Side to Side: 30&quot; Size Large - 40&quot; L x 30&quot; W Overall Depth - Front to Back: 40&quot; Overall Product Weight: 7 lbs Size Small - 30&quot; L x 22&quot; W Overall Product Weight: 6 lbs Overall Depth - Front to Back: 30&quot; ",
        "productname": "4Legs4Pets by Mahar Pet Cot",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb3",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ab896844-c842-4c40-bf56-51b9dbbf035d_1.9c7cbf4cf243201b215aa21c8debf635.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Knot Perfumed Perfumed Body Lotion 6.7oz",
        "productname": "Knot Perfumed Perfumed Body Lotion 6.7oz",
        "productprice": 51,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb4",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c6673c12-058c-429e-b1ae-32640b993829_1.cf7601b1fbe7af055bfdcb9376979a44.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|A poly/cotton sleeveless shirt for every day wear, double stitched in all the right places for comfort and durability! Product Summary : New Pet Products/Red Swiss Dot Paw Screen Print Sh- SKU: ZX9MR51-107SMGY",
        "productname": "Red Swiss Dot Paw Screen Print Shirt Grey Sm - 10",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb5",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/fe9a71ea-a869-4751-abef-fec01c670a25.49aa841052e0bcd95aa0938a4c8ec180.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "The TSP650 series is the fast, entry-level printer that's capable of producing high quality receipts due to the use of the very latest, leading edge components.| High performance, entry-level receipt printer capable of printing at a nonhesitating 150mm per second with an outstanding data throughput High quality 203 dpi print quality with barcode capability including 2D for receipts, coupons and ticketing etc Highly versatile printer with small compact footprint and choice of two paper widths 58mm or 80mm as well as the Star &quot;drop-in and print&quot;, easyload feature ",
        "productname": "Star TSP 654 - label printer - two-color (monochrome) - direct thermal",
        "productprice": 345,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb6",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/fb2781a4-2589-4a85-b5f4-6435e3f08043_1.63dcf58888d8b6c550289fb9a0510ebd.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Take 20-30 drops of extract in a small amount of warm water 3-4 times daily as needed. - Coltsfoot &amp; Wormwood Glycerite Liquid Extract (1:5) - Strawberry Flavored (1 oz, ZIN: 522313): Coltsfoot &amp; Wormwood Glycerite Liquid Extract (1:5) - Strawberry Flavored",
        "productname": "Coltsfoot & Wormwood Glycerite Liquid Extract (1:5) - Strawberry Flavored (1 oz, ZIN: 522313) - 3-Pack",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb7",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b8500019-fa39-452e-8a24-aed50ce51490_1.510046e75fe8c06ed75e9ab89c88b3b7.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Elements Faux Fur Jacket For DogsSuper-soft, luxurious faux fur is lined with shiny satin in Elements Mixed Faux Fur Jackets, for a look that beautifully combines style with warmth.In this elegant Elements Faux Fur Jacket pairing, the jacket's back and front are made of clipped fur, while the sleeves and hood offer high-pile soft plush, for a stunning look that's as functional as it is fashionable.Hood is trimmed with a soft, hairy yarn to complete the lookAdjustable velcro chest closureHigh-cut, stay-dry bellyMaterial: 100% polyester Exported By Code Builders, LLC|Elements Warm Faux Fur Stylish Jacket For Dogs Available In Rose Or Tan Almond (Large Pink Rose)",
        "productname": "Elements Warm Faux Fur Stylish Jacket For Dogs Available In Rose Or Tan Almond (Large Pink Rose)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb8",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e943ca4b-a54e-4202-95ea-eb22e2ee1cf1_1.9aa7526a203389de593246b5be1f4e4b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|Yellow Dog Design, Inc., is a dye sublimation/heat transfer printing company specializing in the design and manufacture of a unique line of pet collars and leads, as well as Equine fashions, in their local NC facility. This line is passionate about the product as evidenced by the 5 awesome canines that come to work with us everyday, 4 Labs, and 1 Dachshund. They are our models and some of the best product testers in the industry. Alpine Extra Large Step-In Harness. This Harness can be sized from 28-Inch to 36-Inch. The Step-In Harnesses are made in the U.S.A of 100-percent vibrant color-fast polyester with durable plastic slip locks and metal D-rings. Size: Extra Large. Pattern: Alpine.- SKU: YLDG111",
        "productname": "Yellow Dog Design H-ALP104XL Alpine Roman H Harness - Extra Large",
        "productprice": 67,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bb9",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/fed53f8f-1845-4d54-a174-2335171e98b9_1.205ed7b487ef41a4b805ec895257fe9d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Boscoli Olive Salad Italian Oil, 32 OZ (Pack of 6)|Family. www.Boscoli.com.",
        "productname": "Boscoli Olive Salad Italian Oil, 32 OZ (Pack of 6)",
        "productprice": 64,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bba",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f312c9cf-0f8d-434a-8518-3b6ff24c7879.ae1cf98d9244923d00f365986cccd6fe.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Mirage Pet Products Plain Leather Yellow Dog Collar, 14&quot;|Plain Leather Collars Yellow 14",
        "productname": "Plain Leather Collars Yellow 14",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bbb",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/3f547cc2-991c-45a9-8a9f-9b33571923e0_1.b1bf48353992625e302b5d1e481c46ec.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|It's made from nylon. Reasonable structure, sub-grid storage. It is waterproof, Wearable, practical. Has large capacity, can hold a lot of things. Easy to clean waterproof lining and pockets. Fits all the bathroom and shower essentials. Stablity:solid shape,stand steady,and hanging. Waterproof:outer and inner. Features Reasonable structure, sub-grid storage Creative Multifunction Wash Bag Portable Travel Pouch Cosmetic Bag Has large capacity, can hold a lot of things Specifications Color: Dark Blue Size: 11.8 x 3.3 x 7.3&quot; - SKU: PND992",
        "productname": "Panda Superstore PS-SPO7702515011-SUSAN00280 Creative Multifunction Wash Bag Portable Travel Pouch Cosmetic Bag&#44; Dark Blue",
        "productprice": 99,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bbc",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/af456349-f196-4e4a-8e67-d86d112f9781_1.5c26e17fb76cfb7bdaad1ef60549353c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "Buy Ralyn Foot Ralyn Shoe Care Sure Steps 2 Pairs. How-to-Use: Clean and dry area. Remove dirt from sole of shoe, using a light piece of sandpaper or emery board. Remove backing. Place on bottom of sole as shown in picture.|Ralyn Shoe Care Sure Steps 2 Pairs",
        "productname": "Ralyn Shoe Care Sure Steps 2 Pairs",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bbd",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b49e0eec-e4a3-4b41-8700-5198eedaee36_1.904b9c546bf9a86a4e2aa10a44f61121.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Pets",
        "productdescription": "|",
        "productname": "Auburn Leathercrafters Tuscany Leather Dog Collar",
        "productprice": 50,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bbe",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/dcd79e5e-76b7-42f7-9664-9745be14008e_1.4053ef571358306b50aa5bee647bb6c1.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Eau De Parfum Spray 2 Oz|Women's Jimmy Choo Blossom By Jimmy Choo",
        "productname": "Women's Jimmy Choo Blossom By Jimmy Choo",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bbf",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e46db349-bef4-4815-8ff4-5a4507099799_1.1285549a858d2c76424305c5b408a0b1.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Radiant Smoothing Cream Cleanser Cleanse your way towards younger-looking, revitalized skin with Revitalift Radiant Smoothing Cream Cleaner. This gentle foaming cleanser helps to remove all traces of makeup and impurities. It gently exfoliates dead skin cells and helps enhance skin smoothness and radiance. This new generation cleanser complements your daily RevitaLift anti-aging moisturizer action.| Product Features With revitalizing vitamin C &amp; gentle exfoliating action Complements your daily Revitalift anti-aging moisturizer action Dermatologist tested for gentleness. All skin types L'Oral USA, Inc., New York, NY, 10017.",
        "productname": "L'Oreal Paris Skin Expertise Revitalift Radiant Smoothing Cream Cleanser, 5.0 fl oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc0",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f5b7f55a-1977-4fcd-b042-bdf6ab149790_1.056e8edc5d35af24b529e0b384d782ad.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|An oriental spicy fragrance for unisex Inspired by a dry &amp; hot wind in Morocco Splendid, seductive &amp; passionate Contains notes of honey, musk, incense &amp; tobacco leaf Infused with hay sugar, amber, iris, rose &amp; sandalwood Ideal for all occasions",
        "productname": "Chergui Eau De Parfum Spray-50ml/1.69oz",
        "productprice": 113,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc1",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/7d3022ff-4403-4afc-9079-46f8e589f06c_1.368aacd643c7b4328186dacb21207f16.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Toujours Moi By Dana Fragrance Giftset Set-Eau De Cologne Spray 4 Oz &amp; Cologne Spray 1 Oz For Women Sandalwood And Vetiver, With A Floral Touch And Musky Undertones.",
        "productname": "Toujours Moi Set-Eau De Cologne Spray 4 Oz & Cologne Spray 1 Oz By Dan",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc2",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4eb2c45d-088e-4a05-99a9-fc1d95a7054a_1.c511182c3eefbcc3338e508b5f90b110.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Cotton Rounds, Take Alongs, Bag 30 CT Resealable. Press to seal. Premium products. Cotton. Perfect for all your cosmetic needs! 100% cotton. Luxuriously soft - Made from 100% pure natural cotton. Textured Pad: embossed texture great for skin care; can be used to control shine. www.uscotton.com. www.swisspers.com. Made in the USA. 30 count 531 Cotton Blossom Circle Gastonia, NC 28054-5245 800-321-1029| Cotton Rounds, Take Along Resealable. Press to seal. Premium products. Cotton. Perfect for all your cosmetic needs! 100% cotton. Luxuriously soft - Made from 100% pure natural cotton. Textured Pad: embossed texture great for skin care; can be used to control shine. www.uscotton.com. www.swisspers.com. ",
        "productname": "Swisspers 30ct Round Take A Long",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc3",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/25014228-3a37-4000-87ac-153bf6931ca3_1.77d89ce8d986d934edfedfa7876d7a0c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Oliga Calura Permanent Shine Hair Color 2 fl.oz. (9-8) 9B",
        "productname": "Oliga Calura Permanent Shine Hair Color 2 fl.oz. (9-8) 9B",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc4",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/a7133b0a-8740-4bb9-b471-04aa7168c94d_1.a2cfcc7a60e1041a8ab73d6841f36fc5.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Double Wear Stay In Place Makeup SPF 10 - No. 93 Cashew (3W2) 1oz",
        "productname": "Double Wear Stay In Place Makeup SPF 10 - No. 93 Cashew (3W2) 1oz",
        "productprice": 52,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc5",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/66a69ed0-1517-492c-b559-3e41db8ef941_1.554e9cd39c5e262be7a40ae9ba4c5a08.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Be Delicious Crystallized Eau De Parfum Spray 1.7oz",
        "productname": "Be Delicious Crystallized Eau De Parfum Spray 1.7oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc6",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/cb304f91-46c0-47b9-b3e1-38b752f1f0c6_1.6e922de26930e4ad79515a5951f4da5f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Total Effects, 7 in One, Dark Circle Minimizing CC Cream, Box 0.2 OZ 7 in One. Color + correction. Brush applicator. Instant skin perfecting coverage + correction to reduce the appearance of darkness under the eyes. Total Effects Fights 7 Signs of Aging: 1. Dark Circles: immediately reduces the appearance of dark circles. 2. Fine Lines: reduces the look of wrinkles. 3. Puffy Eyes: massage to reduce the look of puffiness. 4. Loss of Firmness: hydrates for firmer skin appearance. 5. Uneven Texture: visibly renews skin texture. 6. Uneven Tone: evens skin tone. 7. Dryness: provides nourishing moisture. Why is this product right for you? This gentle brush provides instant skin perfecting coverage + correction to reduce the appearance of darkness under the eyes. For perfecting coverage + correction beyond the eyes, use with Total Effects CC Tone Correcting Moisturizer with Sunscreen. Www.olay.com. Prior to first use, click end of pen several times to begin product flow. Click 1-2 times and use the gentle brush applicator to apply product. Use finger to massage and blend any excess until absorbed. Avoid contact with eyes. If contact occurs, rinse thoroughly with water. To clean, wipe brush with dry cloth or tissue. 0.2 fl oz (6 ml) Cincinnati, OH 45202 800-285-5170|CC Cream, Dark Circle Minimizing",
        "productname": "P & G Olay Total Effects CC Cream, 0.2 oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc7",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e97e7994-7278-4b8e-8259-4d957a36c8bf_1.ce5f3f04a1d122b0eccec0c9af1ff156.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Browse through a wide collection of apparel accessories created for different occasions and styles to suit individual choices. Our items are specially designed to be attractive and affordable and would surely impress anybody with the exceptional finish and looks. Features Knit Headbands with Rhinestone Embellishment These headbands come in assorted colors One size fits most adults Case of 120 Specifications Weight: 0.21 lbs - SKU: ERS43172",
        "productname": "Eros ATT882930 Knit Headbands with Rhinestone Embellishment - Case of 120",
        "productprice": 354,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc8",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/d539eabe-6143-491a-aa20-105ac17a4906_1.b72f2d5b641150a6df8c36728d11e751.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Strawberry Shortcake 'Dolls' Compact Mirrors / Favors (4ct)",
        "productname": "Strawberry Shortcake 'Dolls' Compact Mirrors / Favors (4ct)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bc9",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4ae63feb-f44f-4fd9-ab66-db776a1b5215_1.cfd7f245173306aa123ca745ee2c50ea.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Color Pop Polish - Frisky|LA Girl Color Pop Polish, Frisky, 0.47 Oz",
        "productname": "LA Girl Color Pop Polish, Frisky, 0.47 Oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bca",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4d5076cf-5289-4cc4-8d8b-0f94860bbddc_1.fddec075573305d990328c52bddf8d2f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Regarding Acrylic Acrylic is a useful, clear plastic that resembles glass. But it has properties that make it superior to glass in many ways. It is many times stronger than glass, making it much more impact resistant and therefore safer. Acrylic also insulates better than glass, potentially saving on heating bills. Adding to this favorable array of properties, a transparency rate of 93% makes acrylic the clearest material known. Very thick glass will have a green tint, while acrylic remains clear. Note : 1,Although it has a hard and clear surface, please avoid sharp scratch to keep its aesthetic. 2,Acrylic also insulates better than glass or plastic, but please don't close to the source of ignition to avoid damaging. 3,Cosmetic organizer isn't the Anti-Pressure product, please don't place too heavy articles.",
        "productname": "Beauty Acrylic Makeup Organizer Luxury Cosmetics Acrylic Clear Case Storage Insert Holder Box (1303)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bcb",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/cd582a60-da0b-47fd-b82a-0474c280a4b9.da58aacc2f50e60c89989f7b26c00b41.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Ultra Slick Lipstick - # Pure Impulse 0.13oz",
        "productname": "Ultra Slick Lipstick - # Pure Impulse 0.13oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bcc",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4b502667-29b9-4a14-a2a5-6427c99b4ca8_1.5386fbc308db80ab4da76c513a751166.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "GEL-558 I DO!|Jessica GELeration Soak-Off Gel Polish",
        "productname": "Jessica GELeration Soak-Off Gel Polish 0.5oz/ 15ml (GEL-558 I DO!)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bcd",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/a431ed46-1264-40c4-af29-0e8cc7c854a2_1.f9fdc39ae9b563630899752c8220a065.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "EDT SPRAY 1 OZ|LYON'S LEGACY EMPIRE by Simon James London EDT SPRAY 1 OZ",
        "productname": "LYON'S LEGACY EMPIRE by Simon James London EDT SPRAY 1 OZ",
        "productprice": 69,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bce",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/1d7b930f-dd14-4179-85a8-1b9d3b91805b_1.681cc84697196fa3975dbae62cff2958.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": " The item you will be getting is Tory Burch Absolu Roller Ball 0.2 oz / 6 ml Eau De Parfum. It is in the category Eau De Parfum. It is a BRAND NEW product Product condition: Sealed, Never Used. The picture is an ACCURATE REPRESENTATION. Please contact us if you need a specific batch. All our products are 100% AUTHENTIC . If there is any issue with the item, please contact us before leaving feedback. We will resolve ALL issues within 24 business hours and RESHIP VIA PRIORITY MAIL if needed. |Tory Burch Absolu Roller Ball 0.2 oz / 6 ml Eau De Parfum",
        "productname": "Tory Burch Absolu Roller Ball 0.2 oz / 6 ml Eau De Parfum",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bcf",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/64d1240f-dd69-4c39-b15e-fbc7fb851c28_1.d6beaeedbd5ae286ed78a2f9a439f8e4.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Launched in 1992 by Fubu, FUBU PLUSH is classified as a fragrance. This feminine scentis a refreshing blend of coriander, mimosa, vanilla, musk and sandalwood. It is recommended for daytime wear.",
        "productname": "Fubu Eau De Parfum Spray 1 oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd0",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/9982c1d3-add7-425b-ad42-7fc0737fcafa_1.44233b5cb411f6dc3dbd7439d4a12f05.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|CSC Spa offers a complete line of saloon and spa products. We offer high quality products for hair, skin and nails. We create unique and patented aesthetic saloon equipment, furniture and tools. We are committed to create spa furniture that is modern, functional &amp; aesthetically appealing. All of our solutions are designed with your workday in mind, with performance and savings that are always at work for you. This portable device uses bio wave energy &amp; vibration to remove wrinkles around eyes, lift facial skin and penetrate products such eye creams and essence deeper into the eye area &amp; skin. Features Bio Wave Eye Wrinkle Remover - SKU: CLSPC302",
        "productname": "CSC Spa KD-8908 Bio Wave Eye Wrinkle Remover",
        "productprice": 75,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd1",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6821b981-0275-4452-8835-06d2e30b4463_1.e74b2d06feba82fa511e6d8fc73b7045.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|",
        "productname": "Invictus by Paco Rabanne",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd2",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f7019dab-070d-42e8-9bd5-d93c2c8e7429_1.29ae2251dd18ece68ad840ca134f1afe.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "If you want to enhance the color of your hair and make sure that it stays perfectly true to you, Clairol Nicen Easy permanent color crme gives you the nicest and easiest way to refresh your look from the comfort of your home. Our breakthrough Color Care permanent crme has conditioners built into every step. It gives you 100 percent gray coverage with real natural looking tones and highlights while being kind to your hair. Whats better? Its nicen easy. Plus, it helps you keep gray hair at bay by providing real, natural looking luminous color. With Clairol Nicen Easy permanent coloring crme you get the color that cares for your hair. Color: 5 Medium Brown. Gender: Female.|Clairol Nice 'N Easy Medium Brown (Pack of 20)",
        "productname": "Clairol Nice 'N Easy Medium Brown (Pack of 20)",
        "productprice": 217,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd3",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b10fdde8-c0b4-4920-bca8-1a667022ffe9.c078ff06746ca80d84d883910ab388c3.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Adore Shining Semi Permanent Hair Color|What it is: Adore, the new and innovative, Semi-Permanent Hair Color will infuse each strand with a vibrant burst of luxurious color with No Ammonia, No Peroxide, and No Alcohol.What it does: Adore is a Semi-Permanent Hair Color that deposits natural looking color while giving your hair a healthy resilient shine, leaving your hair in better condition than before coloring.What else you need to know: Adore's exclusive formula offers a perfect blend of natural ingredients providing rich color, enhancing shine, and leaving hair soft and silky.Deionized water (Aqua), aloe vera (aloe barbadensis), citric acid, hydrolyzed collagen, octoxynol-9, hydroxypropylmethylcellulose, ppg-1, peg-9 lauryl glycol ether, methylchoroisothiazolinone, methylisothiazolinone, propylene glycol, sodium citrate, fragrance (parfum) May Contain: CI48035, CI11320, CI11055, CI51004, CI42420, CI 27720, CI48055. Shampoo, and towel dry Use protective cream around hair line Apply hair color 1/8&quot; from scalp, and comb through thoroughly Cover with plastic cap, and process with heat for up to 15 mins Rinse and shampoo completelyProduct Options Available are as follows: Color : 10 Crystal Clear Color : 104 Sienna Brown Color : 106 Mahogany Color : 106 Mahogany Color : 107 Mocha Color : 108 Medium Brown Color : 109 Dark Chocolate Color : 110 Darkest Brown Color : 112 Indigo Blue Color : 113 African Violet ado02-114 Color : 116 Purple Rage Color : 117 Aquamarine Color : 118 Off Black Color : 120 Black Velvet Color : 121 Jet Black Color : 130 Blue Black Color : 30 Ginger Color : 38 Sunrise Orange Color : 39 Orange Blaze Color : 46 Spiced Amber Color : 48 Honey Brown Color : 52 French Cognac Color : 56 Cajun Spice Color : 58 Cinnamon Color : 60 Truly Red Color : 64 Ruby Red Color : 68 Crimson Color : 69 Wild Cherry Color : 70 Raging Red Color : 72 Paprika Color : 76 Copper Brown Color : 78 Rich Amber Color : 80 Pink Fire Color : 81 Hot Pink Color : 82 Pink Rose Color : 84 Rich Fuchsia Color : 86 Raspberry Twist Color : 88 Magenta Color : 94 Bordeaux Color : 83 Fiesta Fuchsia Color : 90 Lavender Color : 71 Intense Red 4.612",
        "productname": "Adore Shining Semi Permanent Hair Color - 79 Burgundy Envy",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd4",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/8dbbc233-a903-41d4-94f5-1cc5fec8c7e7_1.e00baddeecfdc55c0c078e6ebb40866d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Juzo 30-40 mmHg, Dynamic, Knee, Max, OT, Short, 3.5cm Silicone, Model 3512MXAD3SBSH IV|Juzo Dynamic Stockings help you live an active life, more comfortably. With the high degree of containment, they deliver firm therapeutic compression for the management of Edema, Lymphedema and advanced Venous Disease.Country of Origin: &nbsp;USA and/or Imported",
        "productname": "30-40 mmHg, Dynamic, Knee, Max, OT, Short 3.5cm Silicone",
        "productprice": 74,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd5",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e906afec-6a5c-4a77-8456-b142577ac660_1.6f5c2b28c7672cd603470bfdd421dc3e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "These are first quality, tough plastic molds made by one of the leading manufacturers of candy and soap molds in the United States. They are durable and reusable. Made of clear, environmentally friendly PETG plastic. Not for use with hard candy. Cannot be washed in dishwasher. FDA approved for use with food preparation. Not suitable for children under 3.| 2 cavities; Dimensions per cavity: 4&quot;x 2-3/8&quot; lifesize; Cavity capacity in oz: 2.0 Includes FREE Cybrtrayd Copyrighted Chocolate Molding Instructions Bundle includes 6 Molds Uses: Chocolate, soap, plaster ",
        "productname": "Bulb Chocolate Candy Mold with Exclusive Cybrtrayd Copyrighted Molding Instructions, Pack of 6",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd6",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b59ca90c-b1f9-4f27-881b-6b89de2c0456_1.2c61fb96ba82cc0f071bba69ca162741.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Raspberry Chamomile Tea (Loose) (8 oz, ZIN: 530881): Our Raspberry Chamomile Tea is a delicious flavored Chamomile tea with Raspberry Leaf (Red) that you will enjoy relaxing with anytime! - Ingredients: Chamomile tea, Raspberry Leaf (Red) and natural raspberry flavor. - Hot tea brewing method: Bring freshly drawn cold water to a rolling boil. Place 1 teaspoon of tea for each desired cup into the teapot. Pour the boiling water into the pot, cover and let steep for 2-4 minutes. Strain and pour into your cup; add milk and natural sweeteners to taste. - Iced tea brewing method: (to make 1 liter/quart): Place 5 teaspoons of tea into a teapot or heat resistant pitcher. Pour 1 1/4 cups of freshly boiled water over the tea itself.|Raspberry Chamomile Tea (Loose) (8 oz, ZIN: 530881)",
        "productname": "Raspberry Chamomile Tea (Loose) (8 oz, ZIN: 530881)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd7",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/7741d0ac-66f8-41d6-8908-37646f2fe44d.a580737762b10a82eec461149eb554f2.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "This new Ames Walker lymphedema armsleeve is designed with a 1&quot; band with silicone strips to provide stay-up support. It helps to manage limb swelling, and the soft fabric makes it easy to put on and take off. The 20-30 mmHg provides firm compression should be used in cases of moderate to severe lymphedema, where there may be some shape distortion. Lymphedema armsleeves are intended to help manage edema swelling in the arm, quite often due to post-mastectomy conditions. Features: 20-30 firm compression contains edema Stylish fabric blends in with your daily wardrobe 75% Nylon, 25% Spandex Made in the USA *The ensure proper fit, please take your measurements precisely.&nbsp;If your measurements are borderline for the next size, you may consider picking the next size up to ensure a comfortable fit.|Ames Walker Women's AW Style 7061 Lymphedema Compression Armsleeve w/ Silcone Band - 20-30 mmHg AW7061-P",
        "productname": "Ames Walker Women's AW Style 7061 Lymphedema Compression Armsleeve w/ Silcone Band - 20-30 mmHg AW7061-P",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd8",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f92b8cb3-82ef-47d4-aafe-c6ac3d2d9934.a610d580682d49453969c0be77b658a0.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "#ESH - 85 watt - 82 volt - MR16 - Bi-Pin (GY5.3) Base - 2,950K | Eiko Incandescent Projector Light Bulb| Color Temperature: 2,950K Average Lifetime: 250 hours ",
        "productname": "Eiko 02760 - ESH Projector Light Bulb",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bd9",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/3a191f32-d19a-4382-9e15-0bc20b13ad99.ef7db1f2954c5022620cd4f59b685f2f.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Coastal Pet Products 06343 PKB14 3/8 Inch Nylon Standard Adjustable Dog Harness, X-Small, 10 - 18 Inch Girth, Pink Bright|Our Adjustable Nylon Dog Harness features high-quality, durable nylon, making it a great everyday harness. Available in a variety of colors, this harness is completely adjustable to get just the right fit for most dogs. Plus, our unique, curved, snap-lock buckle provides added comfort at every step. Features: D-ring on back for easy leash attachment Quality guaranteed Not for use with tie-outs Ideal for walks Harnesses are great walking tools Adjustable nylon harnesses have girth and chest adjustment slides ",
        "productname": "Coastal Pet Products 06343 PKB14 3/8 Inch Nylon Standard Adjustable Dog Harness, X-Small, 10 - 18 Inch Girth, Pink Bright",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bda",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/3adb601c-b6c8-40d6-a6d5-b4ae7936037b_1.4e8cf6ed73d3eaf2627932a65662fdfc.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Jazz up your wedding, anniversary or birthday cakes with a stunning monogram from our Sparkling collection!| Unik Occasions Sparkling Collection Monogram Cake Topper, Silver: Material: Alloy and Czech Crystal Rhinestones Front of the letter is covered with rhinestones Includes 4.5&quot; long prongs ",
        "productname": "Unik Occasions Sparkling Collection Monogram Cake Topper, Silver",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bdb",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/78c21454-346f-46e1-87d3-572bfba6bd9c_1.ac947d8565c30b527165f1d5f6ad526b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "This protects flowers and edibles. Kills 100+ listed insects fast. Kills Aphids, Caterpillars, Japanese Beetles, Leafhoppers, Leaf Miners, Psyllids, Scale, Thrips, Whiteflies and other garden pests listed. Won't harm plants or blooms. Available in the following sizes: 32-ounce bottle, one gallon bottle.| Ortho Flower, Fruit &amp; Vegetable Insect Killer Ready-To-Use, 32 oz: Overview and Benefits: Available sizes: 32 oz bottle, 1 gal bottle How to Use: Shake container gently before using Adjust spray nozzle to give a fine spray Hold sprayer 8 to 12&quot; from the plant to be treated Direct spray toward the upper and lower leaf surfaces and stems where pests appear Spray only until surface is wet When to Apply: Apply to outdoor plants as soon as insect problems are noticed How Often to Apply: Days to wait to reapply: flowers and Ornamentals: 7; Vegetables: 7; Citrus Fruits: 7; Pome Fruits: 12 Max applications per season: flowers and Ornamentals: 5; Vegetables: 4; Citrus Fruits: 5; Pome Fruits: 4 Where to Apply: On roses, flowers, shrubs and listed fruits and vegetables Associated Plants: On roses, flowers, shrubs and listed fruits and vegetables See label for listed fruits and vegetables Benefits: Kills insects on Flowers and Edibles, without harming plants or blooms Packaging: Bottle Active Ingredients: 0.006% Acetamiprid This is not the product label, always read and follow the product label before use ",
        "productname": "Ortho Flower, Fruit & Vegetable Insect Killer Ready-To-Use, 32 oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bdc",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/a1a38cb1-de8a-4047-b559-90d1305ff0a1_1.3fe10dd546506e82fc0cca848d7ff1dc.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Insurrection by Reyane 3.3 oz EDT for women|Size: 3.4 oz 100 ml Fragrance Type: Eau deToilette Spray Packaging: Original RetailBox At ForeverLux, we offer only100% authentic brand name products. The item&nbsp;is&nbsp;brand new and is inthe manufacture's original packaging. &nbsp; ",
        "productname": "Insurrection by Reyane 3.3 oz EDT for women",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bdd",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/76cfbb26-daa6-41f9-9b77-4f16c8ee29a6_1.36f6577fb6aa87979917441bfd7c66d0.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Like my costume? Screen Print Pet Hoodies Bright Pink Size M (12)|A poly/cotton sleeved hoodie for cold weather days, double stitched in all the right places for comfort and durability!",
        "productname": "Like my costume? Screen Print Pet Hoodies Bright Pink Size M (12)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bde",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e81267e2-6d3f-4a9e-959e-3fa81c4c0af5_1.69a750e3dd5d4ca175f37c1aa62574ee.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "EAU DE PARFUM ROLLERBALL .33 OZ MINI|COUTURE LA LA JUICY COUTURE by Juicy Couture EAU DE PARFUM ROLLERBALL .33 OZ MINI",
        "productname": "COUTURE LA LA JUICY COUTURE by Juicy Couture EAU DE PARFUM ROLLERBALL .33 OZ MINI",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bdf",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/8b3f7834-c020-4b12-b77a-bf0227632160_1.123821ffef9e69a180959697a3077e3d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Ice Bag Relief Pak - Item Number 111061EA|Manufacturer # 111061 Brand Relief Pak&reg; English Ice Cap Manufacturer Fabrication Enterprises Application Ice Bag Dimensions 9 Inch Material Rubberized Fabric Size Circular Target Area General Purpose UNSPSC Code 42142111 Usage Reusable Features English style ice bags are made of waterproof rubberized fabric with a plastic screw cap Securely keeps ice and water melt inside the bag 1 Each / Each",
        "productname": "Ice Bag Relief Pak - Item Number 111061EA",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be0",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/3f225ede-576f-42c6-b2db-feb3106abcf8_1.0aa292d4bcb5ecfe601766c7331833c2.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Format: Retail Pkg Age: Platform: N/A Easily keep photos safe and protected while you&quot;&quot;re on the go with the Travelon Pebble Grain Photo Envelope. This cute and stylish envelope makes it easy to keep your photos safe, especially while traveling, so you don&quot;&quot;t accidentally bend or crease them. Each pouch features a cute envelope design with pebble grain exterior, and closes securely thanks to the snap closure. The envelope can easily fit photos up to 5 x 7 in size and is the perfect way to carry around holiday photos, vacation photos, and more. |Keep all your preciousphotos safe and protected Product Information Easily keep photos safe and protected while you're on the go with theTravelon Pebble Grain Photo Envelope. This cute and stylish envelopemakes it easy to keep your photos safe, especially while traveling, soyou don't accidentally bend or crease them. Each pouch features a cuteenvelope design with pebble grain exterior, and closes securely thanksto the snap closure. The envelope can easily fit photos up to 5 x 7 insize and is the perfect way to carry around holiday photos, vacationphotos, and more. Product Features Ideal way to keep photos safe, especial while traveling Features a cute envelope design with secure snap closure Envelope easily fits photos up to 5 x 7 in size Perfect for your holiday photos, vacation photos, and more Specifications Exterior Color: &nbsp;Natural (Tan) Exterior Pattern: Pebble Grain Interior Color: Green Photo Compatibility: Holds photos up to5 x 7 in size Closure Type: Snap Closure Dimensions: 7.25&quot; x 5.6&quot; x 0.6&quot; (W x Hx D, Approx) ",
        "productname": "Travelon Pebble Grain Photo Envelope (Natural)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be1",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/aa06b8d0-5506-44f1-adfb-c1b9c472c538_1.8fe1d444cf5fd5b33e3d30bd63312a19.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Slick N Smooth Deluxe Silicone Lube:|This silky smooth lubricant is the highest medical grade silicone lubricant on the market. Long-lasting and is never sticky or tacky. Does not promote bacteria growth, non-staining and has no fragrance. This is a deluxe lubricant that both partners will enjoy. Do not use with other silicone toys or products. 2.5 fl oz.",
        "productname": "Slick N Smooth Deluxe Silicone Lube",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be2",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/d6aed948-5c58-44f7-9398-b0dbd8a1d89a_1.10e82c2c479ad2a49160444432a71a6f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "689773829065|Spirits find the fragrance of Aura Accord's Conjure Oil very appealing so sprinkling it at the base of all candles before lighting to attract those spirits necessary to accomplish the intention one seeks.",
        "productname": "Conjure Aromatherapy Scented Oil Imagine Create Future Desires 2 Dram Bottle by Aura Accord",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be3",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/03ab9bb3-221c-4253-9088-44ee8137bb5a_1.bfbf5ec032f5b068dae9d05fb3e1ad39.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Features Contemporary relaxed design that delivers gradient compression therapy yet can be worn all day Reinforced heel resists shoe abrasion and strong yarns resist wear and tear All - Day Comfort Knee Band keeps socks up without binding or pinching Anti - microbial / Anti - fungal Finish promotes healthy foot care and prevents odors Latex Free Graduated Support Level - 15 - 20 mmHg Size - XL Color - Black - SKU: CMS286",
        "productname": "Complete Medical 113103 Casual Medical Legwear For Men&#44; 15-20mmhg&#44; Extra Large&#44; Black",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be4",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b3ffada5-61d1-4234-a28c-58d0b62d6ae5_1.b08dedcc0dff3b78544f7ccc41f7dbef.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Stay cool and refreshed by putting on this Hollister Newport Beach Body Spray. This product is a casual scent for men from California-inspired brand Hollister. This men's body spray has nature-inspired packaging. This fragrance features woody notes of bamboo leaves and driftwood. It gives way to deeper notes of musk to create a scent that's both crisp and mysterious. Wear this fresh scent while enjoying time outdoors, strolling the beach or hanging out with friends. It will make a handy addition to your personal care products. This personal care product comes in a convenient spray can that's 4.2 oz. Hollister Newport Beach by Hollister Body Spray 4.2oz 125ml Men:| Cool and refreshing It's a casual scent for men from California-inspired brand Hollister Features woody notes of bamboo leaves and driftwood Spray can makes it easy to applythis men's body spray Gives way to deeper notes of musk to create a scent that's both crisp and mysterious Wear this men's body spraywhile enjoying time outdoors, strolling the beach or hanging out with friends ",
        "productname": "Hollister Newport Beach by Hollister Body Spray 4.2 oz-125 ml-Men",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be5",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/cb8bbffd-c5a8-49a4-ba42-6a0fe8231e3f_1.b01b5fc0bddab2daa6ca689e1fa5aceb.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|WHAT IS THE SHELF LIFE OF SURTHRIVAL PINE POLLEN? SHELF LIFE OF PINE POLLEN TINCTURE AND DRY PINE POLLEN IS INDEFINITE. *ALWAYS STORE IN A COOL DRY PLACE AND USE FRESH PINE POLLEN TO MAXIMIZE POTENCY. USE THE POLLEN WITHIN TWO MONTHS AFTER OPENING TO PROHIBIT ANY MOISTURE FROM ACCUMULATING IN THE POLLEN. IS PINE POLLEN FOR MEN AND WOMEN? THE SHORT ANSWER...BOTH. FOR BUILDING ENERGY AND VITALITY, IN MEN AND WOMEN, ESPECIALLY AT MENOPAUSE/ ANDROPAUSE, PINE POLLEN IS FANTASTIC.",
        "productname": "Surthrival Pine Pollen Pure Potency 50ml",
        "productprice": 64,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be6",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/04f44715-c7ac-4533-8082-0a03dd1262da_1.b0ca95a3e177507759de24e9ad2eee95.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|STARWEST PLANTAIN LEAF POWDER WC 1 LB",
        "productname": "STARWEST PLANTAIN LEAF POWDER WC 1 LB",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be7",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/6412bcd9-216c-4291-8287-e2324aadd484_1.491c3613cca13c55e30f631a51883604.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Those who have raised puppies know they have lessons to teach: smile more; play hard; sleep soundly; love without inhibition. These lessons and more are demonstrated in twelve charming full color photos and accompanying text. The large format wall calendar features daily grids with ample room for jotting notes; six bonus month of July through December 2017; moon phases; U.S. and international holidays.| 12&quot; x 12&quot; size (opens to 24&quot; tall x 12&quot; wide) Large spaces to write 18 months of usable grids Bonus information like holidays, observances and moon phases High-quality paper stock Protective shrinkwrap ",
        "productname": "Willow Creek Press 2018 What Puppies Teach Us Wall Calendar",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be8",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e67e14a5-9189-4670-8491-0fbd0b1f6f1f_1.4640127e96468d1330df2632777ee1be.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "water tight, heat-sealed padded seat is easy to clean and comfortable. snap on attachment. fits 6437alumex commodes. SKU:ADIB000V8DS7S|Water tight, heat-sealed padded seat is easy to clean and comfortable. Snap on attachment. Fits 6437ALumex commodes.",
        "productname": "lumex 6437s007a snap-on padded commode seat",
        "productprice": 86,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498be9",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f5811e65-4925-49d4-a742-3393cb2a4907.b5b6b213f654871b9bfb89157c3e396a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Spicebomb by Viktor &amp; Rolf - Men - Eau De Toilette Spray 5 oz",
        "productname": "Spicebomb by Viktor & Rolf - Men - Eau De Toilette Spray 5 oz",
        "productprice": 144,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bea",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/dc3d6f91-bbb4-49f6-b137-18061f220696_1.5be2c7e31d398e976a0f746c79e0b113.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Counterfeit detector pen with UV light cap is an inexpensive tool for detecting bad bills with two effective tests in one convenient, pocket-size unit. Patented ink tests the paper fibers for auth- SKU: ZX9SPRCH40481",
        "productname": "Counterfeit Detector Pen&#44; with UV Light Cap&#44; Black",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498beb",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ef6f151c-f569-4b34-b97d-e9ba11a9f5d4_1.6d8ddf104f9c68232e6200ee49fc7752.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Yellow Dog Design, Inc., is a dye sublimation/heat transfer printing company specializing in the design and manufacture of a unique line of pet collars and leads, as well as Equine fashions, in their local NC facility. This line is passionate about the product as evidenced by the 5 awesome canines that come to work with us everyday, 4 Labs, and 1 Dachshund. They are our models and some of the best product testers in the industry. Our Roman Harnesses are made in the U.S.A. of 100% vibrant color-fast polyester with durable plastic slip locks, metal O-Rings and metal D-Rings. Best of all our harness is washable. Small/Medium: 3/4Width x 14-20&quot;Chest. Pattern: Tiki Print.- SKU: YLDG6824",
        "productname": "Yellow Dog Design H-TK101SM Tiki Print Roman Harness - Small/Medium",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bec",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/69e8c24e-e5ad-4f29-8f0b-ff80f55072ba_1.8cf5bd1d017237a8ca208291fb52b136.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "iScholar Pocket Portfolio Inches 30400|iScholar Pocket Portfolio Inches 30400 iScholar Twin Pocket Poly Portfolios are very durable. The two pockets hold generous amounts of letter-size documents. Ideal for school, home or work, these portfolios measure 11.5 x 9.5 inches. Assorted colors. iScholar is a leading manufacturer of school, home and office paper supplies. Enter your model number above to make sure this fits., Durable poly construction, Available in a range of bright colors (color may not be specified), Dual pockets, 11.5 x 9.5 inches, Ideal for school, work or home",
        "productname": "iScholar Pocket Portfolio Inches 30400",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bed",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b3abe0e7-a4de-4d0e-80a9-b46970f2ee93_1.d43fb1d120a528be7accdeec3a42f487.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Strong Leather Company - Side Open Double Id Removable Flip-Out Badge Case - Dress. Dr Bdg Cs Fw 2Id R/Flp 1128. Removable Flip-Out Cases Have The Unique Features Of Displaying Your Badge Either In Your Breast Pocket, On Your Belt Or Around Your Neck For All Badge Fit Information, Please Refer To The Link Below. Badge Manufacturer And Model Number Must Be Identified Before Cutout Is Selected To Ensure Proper Fit. Badge Cutout Fit Guide All Cutouts Are Considered Special Order Items And Are Non-Returnable And Cannot Be Cancelled Once Ordered. If You Need Further Information, Please Contact Your Ras At 800-359-6912.",
        "productname": "Strong Leather Company 88950-11282 Dr Bdg Cs Fw 2Id R/Flp 1128 - 88950-11282 - Strong Leather Company",
        "productprice": 52,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bee",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/a0b2118a-4e57-4318-83ce-4bb30f5129c3_1.0d1847b9be54bf5b10ba80dd3c489236.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Quality Choice NON-ASPIRIN REG STR TAB 325 100TB ",
        "productname": "5 Pack QC Pain Relief Regular Strength Acetaminophen 325mg 100 Tablets Each",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bef",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b509fc9d-f1b4-4747-9846-7f39980f78b7_1.117910a1e62f03b2a455598920abc421.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "112 M by Marilyn Miglin Eau De Parfum Spray 3.4 oz-100 ml-Women|Wrap yourself up in some classic elegance with this fragrance. It will leave you wanting for nothing more. A feminine scent with a hint of mystery just like you. 112 M by Marilyn Miglin ",
        "productname": "112 M by Marilyn Miglin Eau De Parfum Spray 3.4 oz-100 ml-Women",
        "productprice": 74,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf0",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/026ce432-6994-4447-b992-b1879caf11a8_1.dbe5beb6b519e0a7955cb69aab586205.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|A silky-creamy bronzing powder Inspired by sun-drenched destinations Adds a healthy, natural warmth to the complexion Gives a dimensional matte, sun-kissed finish Allows you to customize your glow, from a hint of light to just-stepped-off-the-beach bronze Available in a range of shades for various skin tones ",
        "productname": "Becca - Sunlit Bronzer - # Bali Sands -7.1g/0.25oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf1",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/168b822e-9b88-4cdb-a95a-eb917ce16f1c_1.5a71d54e75d02ad68ae011dc2dec4491.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "You'll look like a straight up punk rocker with this Green Hairspray. Mix it with black for an edgy look! Don't limit this just to Halloween, use it all year round to change up your style!|Green Hairspray",
        "productname": "Green Hairspray",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf2",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/184e1003-6f8d-4e10-b1c9-2148d65ac9e5_1.45eb16a449a8fd83867d45a21368d652.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "***LOOKING TO PUT TOGETHER A PARTY? - ADDITIONAL ITEMS FROM SELLER SHIP FOR $.75 EACH***|Put some The Party Continues 60th Birthday Confetti into the invitation envelopes as a little taste of the festivities to come. At the party, sprinkle some on the table around the cake to add some shine. The confetti includes colorful dots and stars plus happy birthday and 60 cutouts.",
        "productname": "The Party Continues 60th Birthday Confetti - Party Supplies",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf3",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/5d9caf92-cd47-4a0e-bc32-7dfa3f41acb3_1.cde15a8b407ad7e605806ecc70bad876.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "|Combination Board Porcelain Markerboard and Vinyl Fabric Tackboard- 4'x10' Style C with Aluminum Framed Marker Board and Tack Board. Combination Boards Overall Size: 48-7/16&quot;- SKU: ZX9GHENT2530",
        "productname": "4 ft. x 10 ft. Style C Combination Unit - Porcelain Magnetic Whiteboard and Vinyl Fabric Tackboard - Ocean",
        "productprice": 446,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf4",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/01ff7ccc-dc90-4e10-8873-682a03b34916_1.8c49d458d7ddf571ba90d5b029237e9a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Medium Weight Color Karate Uniform, Red| &nbsp; Medium Weight Red Karate Uniform Specifications Full elastic pants waistband with pull string. Reinforced stitching at the inseams Gusseted (triangular insert) crotch provides added strength and durability. Jacket sleeve cuffs and pant hems are multiple-stitched to endure any rigorous workouts. Machine washable poly-cotton blend material allows for easy care. White belt, jacket, and pants included. This Medium Weight Red Karate Gi is durable enough for the most intense training and competition. Cuffs and hems are stitched 6 times to resist stress and wear and tare. The polycotton material allows for easy care of your machine washable karate gi. The pants feature an elastic waistband with drawstring for comfortable fit and easy adjustments. &nbsp; ",
        "productname": "Medium Weight Color Karate Uniform, Red",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf5",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/5b3c5459-251a-46af-aad2-7e558ca1e4ba_1.134854c0ccbb80fd6e43f6f198c26080.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Beauty",
        "productdescription": "Amsino Amsure Piston Enteral Irrigation 60ml 60cc Syrigne - 1 Piece. Catheter Tip. 60ml Thumb Control Ring Top Irrigation Syringe. Tip Protector.|AMSure Enteral Feeding/Irrigation Syringe 60 mL Pole Bag Resealable Catheter Tip w/o Safety Case of 30",
        "productname": "AMSure Enteral Feeding/Irrigation Syringe 60 mL Pole Bag Resealable Catheter Tip w/o Safety Case of 30",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf6",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/55c5bf8c-e780-4dfb-935b-d73566751cad.d89c789601b2c13d2f8b8a0c82cd1c59.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Features: -Bulletin board. -Lockable doors. -Acrylic safety glass windows. -Continuous hinges. -Concealed mounting brackets. -Made in USA. Product Type: -Bulletin board. Mount Type: -Wall Mounted. Board Color: -Brown. Surface Material: -Cork. Framed: -Framed. Frame Material: -Plastic. Size 24&quot; H x 18&quot; W - Size: -Small 2' - 4'. Size 36&quot; H x 60&quot; W - Size: -Medium 4' - 6'. Size 48&quot; H x 96&quot; W - Size: -Large 6' to 8'. Dimensions: Overall Thickness: -2&quot;. Size 24&quot; H x 18&quot; W - Overall Height - Top to Bottom: -24&quot;. Size 24&quot; H x 18&quot; W - Overall Length - Side to Side: -24&quot;. Size 36&quot; H x 24&quot; W - Overall Length - Side to Side: -36&quot;. Size 36&quot; H x 24&quot; W - Overall Product Weight: -18 lbs. Size 36&quot; H x 30&quot; W - Overall Product Weight: -24 lbs. Size 36&quot; H x 36&quot; W - Overall Height - Top to Bottom: -36&quot;. Size 36&quot; H x 36&quot; W - Overall Product Weight: -40 lbs. Size 36&quot; H x 48&quot; W - Overall Length - Side to Side: -48&quot;. Size 36&quot; H x 48&quot; W - Overall Product Weight: -42 lbs. Size 36&quot; H x 6|AAO1191 Features Bulletin board Lockable doors Acrylic safety glass windows Continuous hinges Concealed mounting brackets Made in USA Product Type: Bulletin board Mount Type: Wall Mounted Board Color: Brown Surface Material: Cork Framed: Framed Frame Material: Plastic Size (24&quot; H x 18&quot; W): Small 2' - 4' Size (36&quot; H x 60&quot; W): Medium 4' - 6' Size (48&quot; H x 96&quot; W): Large 6' to 8' Dimensions Overall Thickness: 2&quot; Size 24&quot; H x 18&quot; W Overall Height - Top to Bottom: 24&quot; Overall Length - Side to Side: 24&quot; Size 36&quot; H x 24&quot; W Overall Length - Side to Side: 36&quot; Overall Product Weight: 18 lbs Size 36&quot; H x 30&quot; W Overall Product Weight: 24 lbs Size 36&quot; H x 36&quot; W Overall Height - Top to Bottom: 36&quot; Overall Product Weight: 40 lbs Size 36&quot; H x 48&quot; W Overall Length - Side to Side: 48&quot; Overall Product Weight: 42 lbs Size 36&quot; H x 60&quot; W Overall Length - Side to Side: 60&quot; ",
        "productname": "AARCO Enclosed Wall Mounted Bulletin Board",
        "productprice": 586,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf7",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/18767ea7-1421-4b77-a360-294c030db3d3_1.400c145abd708834fb19a385e6ff182f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Deluxe Literature Mailer| Features protective side flaps and front outside tuck closure Maximum protection for your most important documents Manufactured from strong 200#/ECT-32-B oyster white corrugated All ship and store flat to save space ",
        "productname": "Box Packaging White Deluxe Literature Mailer, 50/Bundle",
        "productprice": 219,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf8",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/0780e533-8875-4793-b01e-551d9e7881ef_1.c97a52a8c8595c79fbd13c9af6cdbf97.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Perfect for all your paper crafting projects! This package contains twenty-five 12x12 inch double-sided sheets with a different design on each side (all twenty-five sheets are identical). Comes in a variety of designs. Each sold separately. Acid and lignin free. Made in USA.",
        "productname": "Doodlebug 7311164 New! Simple Sets Hello Lovely Double-sided Cardstock 12\"x12\"-so Very Lovely - Case Pack Of 25",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bf9",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/8dd7a6ef-2df6-4fe9-87ed-6ec39ed7d360.c62de8d376e41fc09458fbe4be10408c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "The Matte Colored Corrugated Mailing Boxes are available in a variety of sizes and gorgeous colors. Perfect for small business owners wanting to ship products to their customers in a unique and durable mailing box. Also, makes a great gift box and product packaging box. These mailing boxes feature a tab lock tuck top that will keep your items secure. We ship these boxes flat. Assembly is easy to fold together and does not need any adhesives to hold its shape. Sizes are the outside dimensions of the box.| Quantity: 10 Material: Paper ",
        "productname": "10ea - 16 X 11-1/8 X 6-3/8 Blue Corrugated Tuck Top Box-Pk by Paper Mart",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bfa",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/86670a56-233e-489d-b124-3f54394ad196_1.01e371a9f5e44c590d944f70e9f0c9be.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "This item is guaranted to produce dark long lasting printing on your calculator when you install this C.ITOH Model 200 Compatible CAlculator RS-6BR Twin Spool Black &amp; Red Ribbon by Around The Office|Package of 3 individually sealed RIBBONS, Designed to fit C.ITOH 200 calculator by Around The Office&reg;, Freshly inked supplies provide dark long-lasting use, Live Customer Support for installation, Unconditional Guarantee",
        "productname": "C.ITOH Model 200 Compatible CAlculator RS-6BR Twin Spool Black & Red Ribbon by Around The Office",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bfb",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ee75c3ab-ce48-4295-8ca7-b0d20243ec49_1.ff6b9f4dde408743b9401b15f73e784e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Announce your event using a classic Gatefold style invitation! The stock is scored so the gate doors meet perfectly in the middle, opening to reveal your invitation. For endless possibilities, position your invitation and add a Layer Card to show your own unique style.| Envelopes.com 6-1/4&quot; x 6-1/4&quot; Gatefold Invitation: Size: 6-1/4&quot; x 6-1/4&quot; Paper weight: 105 lb ",
        "productname": "6 1/4 x 6 1/4 Gatefold Invitation - Mandarin Orange (500 Qty.)",
        "productprice": 212,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bfc",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f5b71072-aff2-4ba7-a3ef-09dc1bb30b29_1.a7cc36ed62cea7fb691656517762c1c8.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Bazzill Bling Cardstock 8.5 Inch X 11 Inch-Fresno|BAZZILL-Take top quality cardstock with a touch of shimmer and canvas texture and you have Bling! Size: 8.5x11. Sold in pack of 25/all same color and style (Not sold as individual pieces). Acid and Lignin-Free. Make in China.",
        "productname": "Bazzill Bling Cardstock 8.5 Inch X 11 Inch-Fresno",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bfd",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/1f01759a-9c9a-4d50-a42a-546991c11ce5_1.12f0da4836ec758cd36c16b7f63756d3.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "RHINO 4200 PRINTER|DYMO CORP 1801611 RHINO 4200 PRINTER 1801611 RHINO 4200 PRINTER",
        "productname": "DYMO CORP 1801611 RHINO 4200 PRINTER 1801611",
        "productprice": 117,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bfe",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c7f2acaf-1cae-4f56-bccb-092b9864394f.411a9c95499021f418c87e4da547d0e2.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "A notelet featuring pop-out flaps to transform the package into an envelope. The Moleskine Postal Notebook has a cardboard cover; 8 plain inner pages (100 gsm/68 lb.) of ivory-colored paper; stitch bound in same color as cover; blind debossed Moleskine logo. Specifications: - Layout: Plain Paper - Dimensions: 4-1/2&quot; x 6-3/4&quot; - Soft Cover - Color: Persian Lilac - Pages: 8 - Paper Weight: 100 gsm/68 lb.; FSC Certified Paper; Acid-Free (pH Neutral)|A notelet featuring pop-out flaps to transform the package into an envelope. The Moleskine Postal Notebook has a cardboard cover; 8 plain inner pages (100 gsm/68 lb.) of ivory-colored paper; stitch bound in same color as cover; blind debossed Moleskine logo. Specifications: - Layout: Plain Paper - Dimensions: 4-1/2&quot; x 6-3/4&quot; - Soft Cover - Color: Persian Lilac - Pages: 8 - Paper Weight: 100 gsm/68 lb.; FSC Certified Paper; Acid-Free (pH Neutral)",
        "productname": "Moleskine Messages Postal Notebook, Large, Plain, Persian Lilac, Soft Cover (4.5 x 6.75)",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498bff",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b01669c8-916f-40dc-8bb8-9e17f86aac20_1.9dbe445b80e2d8c98541f3d77c4775fa.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|FBA|SS-CA-SR-FBA||6 Pack of Black/Red ink ribbons",
        "productname": "Compatible Universal Calculator Spool EPC B / R Black and Red Ribbons, Works for Sharp EL 1197 P, Sharp EL 1197 P II, Sharp EL 1197 P III, Sharp EL 1630",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c00",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/ee25c9ad-f44e-4469-b39a-3a303d120473_1.c168fc68aa323e2c38aa864b6f6d57ff.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "100 New Resealable|100 New Resealable Plastic Bags This is a new set of 100 resealable plastic bags These high quality reclosable plastic bags allow you to have the bags you use most on hand The reclosable seals open all the way to the edges of the bags giving you full use of the interior. Each has a 2 mil thickness and measures approximately 4&quot; x 6&quot; (101 x 152 mm)",
        "productname": "100 CLEAR Reclosable Zipper Bag. 4' x 6' - 2 mil. thick",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c01",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/deb4f62c-67cc-4fc4-ae4d-27e0af557e3c_1.b3b4d2c439021be22790564d1df437b2.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|We provide a wide range of products to satisfy all houseware and supplies. We are dedicated to give everyone the very best houseware supplies for all home needs, with a focus on dependability, our client satisfaction and great quality. We provide high-quality modern products to be enjoyed by many clients. Our aim is continuous improvement and user satisfaction through effective implementation and quality of our products. Features 2 x 800 in. Super Clear Seal Tape - SKU: MCDS22502",
        "productname": "Merchandise 55548609 2 x 800 in. Super Clear Seal Tape",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c02",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/c7d1ed72-e1ab-4fb7-8f21-b0abdb7bcbf7_1.e993a7c0b4f9d6e29a423a787c54db84.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Features Porcelain writing surface is indestructible when used as directed and guaranteed for life High contrast Excellent erasing qualities Surface permits use of magnetic accessories All writing board units are equipped with a 1 in. map rail with a tan cork insert and end caps All trim, tray and map rails are finished in satin anodized aluminum Accessory tray runs full length of writing surface 120D Series accessory tray with protective end cap Board Type - Markerboard Size - 4 x 8 ft. Color - Buttercup - SKU: AARC7663",
        "productname": "Aarco Products 120D-48M-242-854 Combination Tackboard at Each End&#44; Buttercup - 4 x 8 ft.",
        "productprice": 354,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c03",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/b55a3e56-f04e-477d-85a2-8a4306104a34_1.f798701a467d033116767c9f77b5b298.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Fusion Double-Sided Cardstock 12&quot;X12&quot;-Yellow Damask|More Info: RUBY ROCK IT-Fusion Double-Sided Cardstock. Perfect for scrapbooking! This package contains ten 12x12 inch double sided sheets with a different design on each side (all ten sheets are identical). Comes in a variety of designs. Each sold separately. Acid free. Imported.",
        "productname": "Fusion Double-Sided Cardstock 12\"X12\"-Yellow Damask",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c04",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e370e96a-e2f7-4ec9-a781-b7027893ad1a_1.6e5536e48321a4104fb549092b9f5f68.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Strong Leather Company - Deluxe Hidden Badge Wallet. Del Sgl Id Bdg Wal 793. This Upgraded Version Offers The Same Advantages Of Badge And Id Concealment. It Also Boasts More Card Slots Along With A License Window, Money And Photo Sections. For All Badge Fit Information, Please Refer To The Link Below. Badge Manufacturer And Model Number Must Be Identified Before Cutout Is Selected To Ensure Proper Fit. Badge Cutout Fit Guide All Cutouts Are Considered Special Order Items And Are Non-Returnable And Cannot Be Cancelled Once Ordered. If You Need Further Information, Please Contact Your Ras At 800-359-6912.",
        "productname": "Strong Leather Company 79230-7932 Del Sgl Id Bdg Wal 793 - 79230-7932 - Strong Leather Company",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c05",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/445f68a7-0c3a-4ba5-a593-815b81bcb9c5.d506f3f0473ed8cbba3a4b08daf21429.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Wire Marking Sleeves, Color White, Width 2 In., Height 7/16 In., Material PermaSleeve(R), Min. Wire Size 3/32 In., Max. Wire Size 7/32 In., For Use With Mfr. No. BBP33, Labels per Roll 500, Shrink Ratio 3:1, Temp. Range -67 Degrees to 275 Degrees F, Standards SAE-AMS-DTL-23053/6 (Class 1), SAE-AS-81531, MIL-STD-202G, Method 215K Features Temp. Range: -67 Degrees to 275 Degrees F Color: White Shrink Ratio: 3:1 For Use With: Mfr. No. BBP33 Max. Wire Size: 7/32&quot; Item: Wire Marking Sleeves Labels per Roll: 500 Height: 7/16&quot; Standards: SAE-AMS-DTL-23053/6 (Class 1), SAE-AS-81531, MIL-STD-202G, Method 215K Width: 2&quot; Material: PermaSleeve(R) Min. Wire Size: 3/32&quot; | Item Type: Wire Marking Sleeves Brand: BRADY Manufacturer Part Number: B33D-250-2-344 ",
        "productname": "BRADY Wire Marking Sleeves,2in.Wx7/16in.H B33D-250-2-344",
        "productprice": 567,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c06",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/d0790e31-11e6-4288-8140-099bc83ee55c_1.7159e94d7aeaafab73e9ede1473a87a6.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "SyPen BRINGS YOU THIS AMAZING 3-IN-1 MULTI-FUNCTION CAPACITIVE STYLUS BALLPOINT LED PEN THAT MAKES YOUR DAY-TO-DAY LIFE EASIER! No other pen on the market comes with as many advantages to its users as ours! This pen operates as a stylus pen for use on the surface of your touchable screen devices, it features an LED light on one end, and also functions as a real writing pen. Finding a pen with these 3-in-1 functions is very rare! OUR PEN IS CONVENIENT, HELPFUL &amp; STYLISH ALL AT THE SAME TIME The removable cap functions as both a pen cover and a stylus for you to use on all your electronic devices that feature a capacitive screen display. Our stylus pen lets you easily glide across your device's screen, thus keeping your touch screen smudge-free at all times! This Metal pen also features a special LED light on the opposite end. Ever have that problem when you're going through your bag full of many items and you can't locate your car keys or hom| 3-IN-1 COMBINATION: SyPen offers our amazing stylus pen, which operates on smart devices, works as an LED flashlight, and also can be used as a standard ballpoint pen! SHED SOME LIGHT: Always be prepared with our uniquely designed stylus pen, which includes an LED flashlight feature! Be ready at night and in dim situations! Simply push the flashlight tip to turn the small white LED light on and off. DURABLE and ULTRA SENSITIVE RUBBER TIP: SyPen designs products that are made to be used again and again! Our stylus pens are made of a special metal material which is stronger than most. The chrome lower barrel and shiny accents give the pen a sophisticated appearance.The Premium Soft rubber tipped end with sensitive touching helps reduce scratches and fingerprints on any touch device, works exactly like you finger. MANY VARIATIONS: This special pen is available in the colors of Red, Silver, Gunmetal, Black, Green, Pink and Blue. You can also choose from a pack of 1 piece, 6 pieces, and 12 pieces. COMPATIBILITY AND PORTABLE: 100% Compatible with all Capactive touch screen devices (Apple iPad 1 and 2, iPhone, iPod, Kindle, Motorola Xoom Tablet, Galaxy, and Blackberry Playbook Virtuoso Touch) and small size clip which can easily be placed in your pocket, purse, or wherever you like! Keep it handy and never be without one! ",
        "productname": "SyPen Stylus Pen for Touchscreen Devices, Tablets, iPads, iPhones, Multi-Function Capacitive Pen With LED Flashlight,Ballpoint Black Ink Pen, 3-In-1 Metal Pen, 6PK, Black Ink",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c07",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/077aed26-b97a-49cd-9397-e065b2e52999.d6f9278b41ee2321e85ffff44506c7a7.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|17&quot; x 17&quot; x 6&quot; Corrugated Boxes. Quality standard strength industrial Corrugated Boxes. Manufactured from 200#/ECT-32 kraft corrugated. Cartons are sold in bundle quantities and ship flat to save on storage space and shipping. 20/Bundle.",
        "productname": "Corrugated Boxes SHP17176",
        "productprice": 75,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c08",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/1e697b09-de0e-4164-9f45-bbf6df1c6299_1.3ef093301fc5b789e116686069756005.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Size :9.0&quot;(L) x 5.5&quot;(W) inches , 7.48&quot; x 0.71&quot; x 2.17&quot; inches.Lightweight and convenient and easy carry.Stylish and attractive outlook.Keep stationery safe with this special pencil case.| Size :9.0&quot;(L) x 5.5&quot;(W) inches , 7.48&quot; x 0.71&quot; x 2.17&quot; inches. Lightweight and convenient and easy carry. Stylish and attractive outlook. Keep stationery safe with this special pencil case. ",
        "productname": "POPCreation Floral School Pencil Case Pencil Bag Zipper Organizer Bag",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c09",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4d4adcbe-9cf0-4e21-9aca-06c2773ad323_1.7d6c778597cba765b01fd0740e13963f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Stuffed Eggplant (turkili) 400g",
        "productname": "Stuffed Eggplant (turkili) 400g",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c0a",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/2831b220-0e9f-4518-8c21-75096902735b_1.9f1989e4fdb3f249d405883f6563a535.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Pet Products has unique directory gives pet lovers local access to the products and services they need for their pets. We provide pet owners a one-stop for products, research, reviews, and local information. These products meet the needs of the pet industry to provide data needed to gain insights into the pet market. We are striving to be the largest pet products directory in the world. Features K9 Natural Freezed Beef Specifications Food Type: Beef - SKU: PTFDE9449",
        "productname": "PetFoodExperts 57577903 K9 Natural Freezed Beef",
        "productprice": 171,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c0b",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/d676c277-bb25-44be-bacd-6fdba433b559_1.8deecfa3ec6ed94130e0a1ef12186263.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|La Source Relaxing Body Lotion 8.5oz",
        "productname": "La Source Relaxing Body Lotion 8.5oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c0c",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/2165f7b9-d60d-460b-9c63-78fcf95bc2ca_1.acbb580ab74b5e6fd27059b5f763a416.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "A smooth consistent sheet in the colors you need. Excellent print and run ability. Our Springhill&nbsp;digital opaque colors come with our electronic imaging guarantee| Guaranteed to run on small and large offset presses, copiers, laser and inkjet printers, as well as plain-paper fax machines 10% PCW Wood sourced from a FSC certified managed forest This product was made from Wood sourced from a FSC certified managed forest Electronic imaging guaranteed A smooth consistent sheet in the colors you need ",
        "productname": "Springhill Digital Opaque Colors Tan, 60lb, Ledger, 11 x 17, 500 Sheets / 1 Ream, Made In The USA",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c0d",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f4adb5b6-9a1e-4a00-8fba-7f67a4ef0191.755d095c180c261dfa63ca8bda31eaca.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Add your own personal message to customize at no additional charge! Once you receive your confirmation email from Walmart, click the &quot;Contact A Birthday Place&quot; link to message us your personalization request. If we do not receive a message within one hour of your order, we will assume you want the topper as-is and with no personalization. Edible icing art is a great way to make a cake and cupcakes look fantastic and professional. These are an easy and inexpensive way to make your cake look like a masterpiece. All icing images come with instructions. Simply remove the edible icing art from backing and place on top of freshly iced cake or cupcakes. After 15 to 25 minutes the edible icing art will blend with the frosting to give your cake a professional look. Prints are professionally printed on compressed icing sheets. Each topper is shipped in a plastic zip lock bag. No refrigeration is necessary! Kosher! Gluten Free! Soy Free! Trans-Fat Free! No Known Allergens! No Peanut Products Added! Printed on high quality edible icing paper (not wafer or rice paper) using high quality edible ink, also certified kosher. Ingredients: Water, Cornstarch, Corn Syrup Solids, Cellulose, Sorbotol, Glycerine, Sugar, Vegetable Oil, Arabic Gum, Polysorbate 80, Vanilla, Titanium Dioxide, Citric Acid. Looking for another theme or design? Contact us for more options!|1/4 Sheet Lego Batman Edible Frosting Cake Topper-*",
        "productname": "1/4 Sheet Lego Batman Edible Frosting Cake Topper-*",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c0e",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/4be522d5-08a9-4c72-8d5a-d66a95d44900_1.23cea704dcce1f55a2183e8016aa432b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Features 3-Part White Carbonless Continuous Computer Forms Size - 8 1/2 in. x 11 in. 1050 forms per case Dimension - 11.5 x 9 x 12 in. Item Weight - 25 lbs. - SKU: ADBS184",
        "productname": "Prime-Kote U24 8.5 x 11 3-Part White Carbonless Computer Forms",
        "productprice": 96,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c0f",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/3b5b1bfb-afd8-49d5-9731-42a99745c6f5_1.87018cb6fdcbbd4249b3b0ae220d7434.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|An intensely moisturizing conditioner for dehydrated curls Concentrated with vitamins &amp; botanicals to soften &amp; nourish dry &amp; unruly curls Detangles hair while repairing damage from excessive heat styling &amp; chemical processes Blended with algae extract &amp; wheat amino acids to retain moisture &amp; shield hair Reveals shinier, healthier &amp; more manageable curls Safe for color treated, permed &amp; straightened curls",
        "productname": "Curl Quencher Moisturizing Conditioner (Tight Curls)-1000ml/33.8oz",
        "productprice": 76,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c10",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e9cde4f4-0193-461b-9f7c-4a30f6f62646_1.522355c12b4b0a57853d1254d6ca5924.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|CLARINS DOUBLE SERUM &amp; EXTRA FIRMING COLLECTION SET",
        "productname": "CLARINS DOUBLE SERUM & EXTRA FIRMING COLLECTION SET",
        "productprice": 67,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c11",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/e2f0442f-de46-4aff-9c1c-b12c54da0f15_1.b73a6209ec61f94b6c9807580424ed8e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "These are first quality, tough plastic molds made by one of the leading manufacturers of candy and soap molds in the United States. They are durable and reusable. Made of clear, environmentally friendly PETG plastic. Not for use with hard candy. Cannot be washed in dishwasher. FDA approved for use with food preparation. Not suitable for children under 3.| 9 cavities; Dimensions per cavity: N/A; Cavity capacity in oz: 0.7 Includes FREE Cybrtrayd Copyrighted Chocolate Molding Instructions Bundle includes 3 Molds Uses: Chocolate, soap, plaster ",
        "productname": "Shell Assortment Chocolate Candy Mold with Exclusive Cybrtrayd Copyrighted Molding Instructions, Pack of 3",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c12",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/06af90b8-7327-4784-9094-00af84430c00.7eb02a3e7ebf1ff012c113e393f41024.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "18 flavor strips Size SA43 1 3/4 by 3 19/32-SA43 size can be used on Vendo (tear side) as well as Dixie Narco (tear top) Size SA36 1 15/32 by 3 1/2- size can be used on Vendo as well as Dixie Narco The Affordable Care Act, or Obamacare, has lots of little hidden provisions that are slowly emerging to try to force you to be healthy. One of these is the requirement that vending machines show calorie count on each item sold. We have now updated many our our popular flavor strips to the newer style showing calorie count. Please look for them on on our flavor strip pages. These are the original flavor strips that are used by national bottling companies, not copies! These strips have small punch out holes for sold out lights Should newer design strips become available before the pictures are updated the newer design strips will be shipped.|Vending-World - 18x Flavor Strip For 12 oz Cans Soda Pepsi Coke Vending, fits Dixie Narco, Vendo",
        "productname": "Vending-World - 18x Flavor Strip For 12 oz Cans Soda Pepsi Coke Vending, fits Dixie Narco, Vendo",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c13",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/a739c6b5-8748-4fbe-9c30-b7686a8c4d9a_1.570e8b65e01418afc18a20938e84dc0f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Economy Grade Sign - Made of .032&quot; aluminum with a High Gloss Finish (28% thicker than other .025&quot; aluminum and tin signs), this 8 inch by 12 inch sign is made in the USA with American made materials and American craftsmanship. It consists of an image baked into a HIGH GLOSS powder coating over aluminum. The image has the appearance of an aged and weathered sign with simulated rusted edges and scratched and faded paint on a HIGH GLOSS powder coated finish. It has smooth rounded corners and includes mounting holes. Each sign is made to order and individually handcrafted. You will find reproductions, vintage looking original designs, clean, new looking signs without the rust and scratches, and many personalized designs. Our signs make great gifts and they are also perfect for your home, office, business, garage, man cave, she shed, dorm room, game room, kitchen or any place you'd like to display this unique sign. We have several thousand different designs available with more being added every day. Personalization:We offer many styles of personalized signs, many that can be customized with names or important dates. The price of this sign includes FREE SHIPPING which usually takes 3 to 5 days in the United States. Edonomy Grade -&nbsp; Made out of .032&quot; thick aluminum (28% thicker than .025&quot; aluminum or tin signs) with a HIgh Gloss finish Durable aluminum won't rust, 8 inches x 12 inches w/ rounded corners and mounting holes Made and shipped in the USA. Don't be fooled by cheap counterfeit signs from overseas. This is American Made! Usually SHIPS IN 1 to 2 DAYS. RECEIVE IT in 4-5 DAYS from a USA Mfr. | Made out of Economy .032 inch thick aluminum (28% thicker than .025 aluminum or tin) with a HIGH GLOSS finish. Distressed versions have simulated rusty edges and faded paint and scratches to give a nice aged and worn look. This one is a HIGH GLOSS FINISH Durable aluminum won't rust, 8 inches x 12 inches w/ rounded corners and mounting holes. Made and shipped in the USA. Don't be fooled by cheap counterfeit signs from overseas. This is American Made! SHIPS IN 1 to 2 DAYS. RECEIVE IT in 4-5 DAYS from a USA Mfr. ",
        "productname": "Brooke's Green Wine Bar Personalized Sign Wall Decor 8 x 12 High Gloss Metal 208120043513",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c14",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/f6d12f99-8920-4ffa-8ec8-e435943f7f66_1.d68c24474f513e1e631e21898df7f4c7.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "One time use tamper evident pull-tight adjustable security seals. Allows the user to cinch-up the seal according to their specific size requirements.A heavy-duty, adjustable security seal designed for use on transportation and storage equipment or anywhere a multi-locking, tamper evident pull-tight security device is needed. Ideal for situations requiring varying seal lengths.Heavy-duty, all plastic, one-piece construction.Tamper-resistant acetal locking mechanism.Weather resistant; withstands extremes of cold and heat.Consecutively numbered.Matted in strips of 10 for ease-of-use.| Tug Tight Pull-Tight Seals SKU :-- SE1009 Color :-- Green Size :-- 15 Inch Material :--Plastic Material Handling Seals Pull-Tight Seals Made In USA",
        "productname": "SE1009 Green 15 Inch Plastic Tug Tight Pull-Tight Seals Made In USA CASE OF 100",
        "productprice": 74,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c15",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/50c435bc-0766-4f95-83c5-0f3d0262ddaf_1.20d8ea011ddc2ed0aa6799953593e5e3.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "|Features Raspberry Bath Bomb Specifications Size: 4.5 oz Scent: Raspberry, Subtle Floral Hint. Country of Origin: United States - SKU: GRNLF5588",
        "productname": "mooi lab d6184096-4.5-oz Raspberry Bath Bomb&#44; 4.5 oz",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c16",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/836585cd-3f57-48d2-a5de-90c5975b15d1_1.9be90a508c8884622a13e17de06f3691.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Office",
        "productdescription": "Granulated Honey This granulated honey is so versatile it offers the delicate, heady flavor of honey in an easy to use form especially for baking! Tiny granules of rich, golden honey (which are about the size of pin heads) are easy to measure in place of sugar for cakes, cookies, pie crusts and can be used in other desserts such as sprinkling over grilled fruit, creme brulees or French toast. Because they are so small and dissolve easily, you can also substitute granulated honey for liquid form honey in savory recipes such as marinades, or use as sweetener for coffee, tea, lemonade and cocktails.Through a unique crystallization process, granulated honey is produced by combining honey and sugar to form this freeflowing product. Granulated honey contains 8-10% honey. |Granulated Honey",
        "productname": "Granulated Honey",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      },
      {
        "_id": "646fa2b5255025ab59498c17",
        "creationtime": "\"2023-05-25\"",
        "creator": "ahmedpandit24@gmail.com",
        "image": "https://i5.walmartimages.com/asr/8055bdbd-a4dc-4bea-8035-4337d8bd237e.044ce7047aeb36b91e336716ff510c9b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        "inventoryspace": 5,
        "productcategory": "Health",
        "productdescription": "Stunning Looking Cat Eye Two Tone Reading Glasses give You an Upscale Look. These Designer Readers will get plenty of compliments. Top Quality Frames with Spring Metal Hinges make them Sturdy yet they have a very Comfortable Fit - You'll Forget you have them on. You'll find them Hard to Live Without. Includes a High Quality Hard Case and Cleaning Cloth, each with an In Style Eyes Logo.|In Style Eyes Cateye Two Tone Reading Glasses",
        "productname": "In Style Eyes Cateye Two Tone Reading Glasses",
        "productprice": 57,
        "productquantity": 20,
        "shippingmethod": "ahmedpandit48@gmail.com",
        "status": "active",
        "totalinventoryspace": 100
      }
     ]
  
    try {
      // Find the seller by their email
      const seller = await Warehouse.findOne({ email: sellerId });
  
      if (!seller) {
        return res.status(404).json({ error: 'Seller not found' });
      }
      console.log(seller);
      // Add the data to the seller's inventory
      seller.inventory.push(...data);
  
      // Save the updated seller document
      await seller.save();
  
      return res.status(200).json({ message: 'Data added to inventory successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };


