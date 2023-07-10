
import ProductDetail from "../models/productdetails.js"; 
import User from "../models/seller.js";
import Warehouse from "../models/warehouse.js";

export const getproducts = async (req,res)=>{
    try{
        const products=await ProductDetail.find();
    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}


export const getproductsadmin=async (req,res)=>{
  console.log("here")
 
  try{
     
     

       ProductDetail.find({}, (err, products) => {
        if (err) {
          console.log(err);
        } else {
          console.log(products+"is the array of orders");
          res.status(200).json({allproducts:products});
        }
      });


    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}

export const addproduct=async (req,res)=>{
    
    const values=req.body.values;
    const useremail=req.body.useremail
    const inventoryspacenew=parseInt(values.inventoryspace);
    const totalquan=parseInt(values.productquantity);
    const totalinventory=inventoryspacenew*totalquan;
    console.log(totalinventory)

    console.log()

    const newProduct=new ProductDetail({...values,creator:useremail,status:"pending",totalinventoryspace:totalinventory});
    
    try{

            console.log(values.shippingmethod);

            await newProduct.save(function(error,user){
              if(error){
                  console.log(error.message)
              }
              else{
                console.log("dpme")
              }
            
          });

            await User.updateOne(
              { email:useremail }, 
              { $push: { inventory: newProduct } })

           await Warehouse.updateOne(
                  { email:values.shippingmethod }, 
                  { $push: { inventory: newProduct } })

           


 
        

        
            res.status(201).json(newProduct)

            
       
        
       
       
    }
    catch(error){
        res.status(409).json({message:error.message});
    }
}


export const updateproduct= async (req, res) => {

    const  {useremail}  = req.params;

    const values=req.body

   

    try {

        const findProduct= await ProductDetail.findOne({_id:values.productid});
        const totalinventoryspace=values.inventoryspace*values.productquantity;
        findProduct.productname=values.productname;
        findProduct.image=values.image;
        findProduct.category=values.category;
        findProduct.productprice=values.productprice;
        findProduct.productquantity=values.productquantity;
        findProduct.productdecription=values.productdecription;
        findProduct.inventoryspace=values.inventoryspace;
        findProduct.totalinventoryspace=totalinventoryspace;

        const result= await findProduct.save();

       

       await  User.findOneAndUpdate(
            { email: useremail, "inventory._id": values.productid },
            { $set: { "inventory.$.productname": values.productname, "inventory.$.image": values.image, "inventory.$.productcategory":values.category
        ,"inventory.$.productprice":values.productprice,"inventory.$.productquantity":values.productquantity,"inventory.$.productdescription":values.productdecription ,"inventory.$.inventoryspace":values.inventoryspace,"inventory.$.totalinventoryspace":values.totalinventoryspace} },
            { new: true }
          )

       await  Warehouse.findOneAndUpdate(
            { email: values.shippingmethod, "inventory._id": values.productid },
            { $set: { "inventory.$.productname": values.productname, "inventory.$.image": values.image, "inventory.$.productcategory":values.category
        ,"inventory.$.productprice":values.productprice,"inventory.$.productquantity":values.productquantity,"inventory.$.productdescription":values.productdecription,"inventory.$.inventoryspace":values.inventoryspace,"inventory.$.totalinventoryspace":values.totalinventoryspace} },
            { new: true }
          )


        const user = await User.findOne({ email:useremail });
        console.log(result);
        res.status(201).json(result)
      
        
        
    } catch (error) {
        res.status(500).json({message:"Something went wrong "})    
    }
    
}

export const deleteproduct=async (req,res)=>{

    const {userid,productid}=req.params;

    const findProduct= await ProductDetail.findOne({_id:productid});


  


  console.log("prodict found")

     User.findOneAndUpdate(
        { email: userid },
        { $pull: { inventory: { _id: productid } } },
        { new: true },
        function (err, user) {
          if (err) {
            console.log(err);
          } else {
            console.log(`Product with ID ${productid} deleted successfully from inventory of user ${userid}`);
          }
        }
      );

      console.log("deleted from user")

      const warehouse= await Warehouse.findOne({email:findProduct.shippingmethod});
      const totalspacefreed=findProduct.totalinventoryspace;
      const warehouseemail=findProduct.shippingmethod;
      warehouse.warehousearea +=totalspacefreed
  
      await warehouse.save();

      if(warehouse){     Warehouse.findOneAndUpdate(
        { email: warehouseemail },
        { $pull: { inventory: { _id: productid } } },
        { new: true },
        function (err, user) {
          if (err) {
            console.log(err);
          } else {
            console.log(`Product with ID ${productid} deleted successfully from inventory of user ${userid}`);
          }
        }
      );}

      console.log("deleted from warehouse")


       ProductDetail.findByIdAndDelete({_id:productid}, function (err) {
        if (err) {
        
          console.log(err);
        } else {
          console.log("Product deleted successfully!");
        }
      });

      console.log("deleted from product")




      res.status(201).json({message:"Product has been deleted"})



      


}

export const setinventory=async (req,res)=>{

    
  console.log("here in set inventory")
    const {values}=req.params;
  
    console.log(values);
    

    try {
       
        var now = new Date();
        var day = now.getDate();
        var month = now.getMonth() + 1; // add 1 to adjust for 0-indexed months
        var year = now.getFullYear();

        var time=month +" /"+day +" /"+year
        console.log(time +" "+values )
        const findProduct= await ProductDetail.findOne({_id:values});

        console.log("done" +findProduct.shippingmethod)
        
        const warehouse=await Warehouse.findOne({email:findProduct.shippingmethod});
        console.log("done")
        console.log(warehouse.warehousearea + "csacascsa")
        if(warehouse.warehousearea>=findProduct.totalinventoryspace){
          findProduct.status="active";
          findProduct.creationtime=time;
          warehouse.warehousearea=parseInt(warehouse.warehousearea)-parseInt(findProduct.totalinventoryspace)
          warehouse.save();
          console.log("here")
        
          await findProduct.save();
          console.log("here")
          
   
          await  User.findOneAndUpdate(
               { email: findProduct.creator, "inventory._id": values },
               { $set: { "inventory.$.status": "active", "inventory.$.creationtime":time,} },
               { new: true }
             )
             console.log("here")
   
             
       
   
          await  Warehouse.findOneAndUpdate(
               { email: findProduct.shippingmethod, "inventory._id": values },
               { $set: { "inventory.$.status": "active","inventory.$.creationtime":time,} },
               { new: true }
             )
             console.log("here")
   
             res.status(200).json({message:"Inventory now active"})

        }
        else{
          console.log("low space")
          res.status(200).json({message:"LowSpace"})
        }
       
     


       
      
        
        
    } catch (error) {
        res.status(500).json({message:"Something went wrong "})    
    }
   

}