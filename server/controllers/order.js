import ProductDetail from "../models/productdetails.js"; 
import User from "../models/seller.js";
import Warehouse from "../models/warehouse.js";
import OrderDetail from "../models/orders.js"; 

export const addorder=async (req,res)=>{

    console.log("here");
    const values=req.body;
  
    
    try{


            // const findProduct= await ProductDetail.findOne({_id:req.body.productid});

            const newOrder=new OrderDetail({...values})

            // const newOrder=new OrderDetail({...values, productname:findProduct.productname,status:"pending", productcategory:findProduct.productcategory,
            // productdescription:findProduct.productdescription,creator:findProduct.creator,shippingmethod:findProduct.shippingmethod
            // ,productprice:findProduct.productprice,shippingservice:"",trackingid:""});
           
           
           
            
            // await User.updateOne(
            //     { email:findProduct.creator }, 
            //     { $push: { orders: newOrder } })
            
            

            // await Warehouse.updateOne(
            //         { email:findProduct.shippingmethod }, 
            //         { $push: { orders: newOrder } })
            
            await newOrder.save(function(error,user){
                        if(error){
                            console.log(error.message)
                        }
                    });

                    
     

            res.status(201).json(newOrder);

            
       
        
       
       
    }
    catch(error){
        res.status(409).json({message:error.message});
    }
}

export const deliverorder=async (req,res)=>{
  const values=req.body

  try {
      console.log(values._id);

      await  OrderDetail.findOneAndUpdate(

          { "_id": values._id },
          { $set: { "status": "delivered", } },
          { new: true }
        )

        
        
  

     await  Warehouse.findOneAndUpdate(
      { email: values.shippingmethod, "orders._id": values._id },
      { $set: { "orders.$.status": "delivered", } },
      { new: true }
        )

        res.status(200).json({message:"Order Delivered"})
      
  } catch (error) {
      res.status(500).json({message:"Something went wrong "})    
  }
  
}

export const cancelorder=async (req,res)=>{
    const values=req.body
 
    try {
        console.log(values._id);



      const order = await OrderDetail.findOne({ "_id": values._id });

// Retrieve the product ID and order quantity
const productId = order.productid;
const orderQuantity = order.productquantity;

// Update the product quantity in the ProductDetail schema
await ProductDetail.findOneAndUpdate(
  { "_id": productId },
  { $inc: { "productquantity": +orderQuantity } }
);

// Update the order status in the OrderDetail schema
const updatedOrder = await OrderDetail.findOneAndUpdate(
  { "_id": values._id },
  { $set: { "status": "cancelled" } },
  { new: true }
);

          
          
    

       await  Warehouse.findOneAndUpdate(
        { email: values.shippingmethod, "orders._id": values._id },
        { $set: { "orders.$.status": "cancelled", } },
        { new: true }
          )

          res.status(200).json({message:"Order Cancelled"})
        
    } catch (error) {
        res.status(500).json({message:"Something went wrong "})    
    }
    
}


export const cancelorderseller=async (req,res)=>{
  const values=req.body

  try {
    console.log(values.orderid)
      console.log("here");

      const order = await OrderDetail.findOne({ "_id": values.orderid });

      // Retrieve the product ID and order quantity
      const productId = order.productid;
      const orderQuantity = order.productquantity;
      
      // Update the product quantity in the ProductDetail schema
      await ProductDetail.findOneAndUpdate(
        { "_id": productId },
        { $inc: { "productquantity": +orderQuantity } }
      );
      
      // Update the order status in the OrderDetail schema
      const updatedOrder = await OrderDetail.findOneAndUpdate(
        { "_id": values.orderid },
        { $set: { "status": "cancelled" } },
        { new: true }
      );

        res.status(200).json({message:"OK"})
      
  } catch (error) {
      res.status(500).json({message:"Something went wrong "})    
  }
  
}

export const refundorderseller=async (req,res)=>{
  const values=req.body

  try {
      console.log(values.orderid );

      const orderitem=await OrderDetail.findOne({"_id":values.orderid})
      const useritem=await User.findOne({"email":orderitem.creator})

    
        useritem.pendingbalance -= orderitem.amount;

        // Set the specific order in the specific user as "refunded"
        const updatedUser = await User.findOneAndUpdate(
          { email: orderitem.creator, "orders._id": values.orderid },
          { $set: { "orders.$.status": "refunded" } },
          { new: true }
        );

        await useritem.save();

        await  OrderDetail.findOneAndUpdate(

          { "_id": values.orderid },
          { $set: { "status": "refunded", } },
          { new: true }
        )



        res.status(200).json({message:"OK"})

      
     
      
  } catch (error) {
      res.status(500).json({message:"Something went wrong "})    
  }
  
}
export const shiporder = async (req, res) => {
  
  const { creator, productid, productprice, productquantity, shippingmethod, shippingservice, trackingid, _id } = req.body;
  
  try {

    console.log("here in ship order");
    const user = await User.findOne({ email: creator });
    const product = await ProductDetail.findOne({ _id: productid });
    const warehouse = await Warehouse.findOne({ email: shippingmethod });
    
    if (!user || !product || !warehouse) {
      throw new Error('Invalid request');
    }

  

    // update product quantity
    const inventoryspace=parseInt(product.inventoryspace);
    const quantity=parseInt(productquantity);
    const total=inventoryspace*quantity

    product.totalinventoryspace-=total
    
    await product.save();

    // update user inventory
    const inventoryItem = user.inventory.find((item) => item._id.toString() === productid);
    if (inventoryItem) {
      inventoryItem.productquantity -= productquantity;
      await user.save();
    } else {
      console.log('Inventory item not found');
    }

    // update user pending balance
    let pendingbalanceuser = parseInt( productprice) * productquantity;

    let pendingbalance = ( parseInt(warehouse.packagingcharges) + parseInt(warehouse.shippingcharges))*productquantity;

    pendingbalanceuser-=pendingbalance

    let totalvalueofuser=parseInt(user.pendingbalance)+ pendingbalanceuser -pendingbalance;
    totalvalueofuser=totalvalueofuser - ((totalvalueofuser)*0.20)
    
    user.pendingbalance =parseInt(totalvalueofuser);
    
    await user.save();

    // update warehouse inventory
    const inventoryItemWarehouse = warehouse.inventory.find((item) => item._id.toString() === productid);
    if (inventoryItemWarehouse) {
      inventoryItemWarehouse.productquantity = parseInt(inventoryItemWarehouse.productquantity) - parseInt(productquantity);
      await warehouse.save();
    } else {
      console.log('Inventory item not found');
    }

    // update warehouse pending balance
    
    warehouse.pendingbalance += pendingbalance;
    warehouse.warehousearea=parseInt(warehouse.warehousearea)+parseInt(total);
    await warehouse.save();

    // update order status and tracking info
    await Warehouse.findOneAndUpdate(
      { email: shippingmethod, 'orders._id': _id },
      {
        $set: {
          'orders.$.status': 'shipped',
          'orders.$.shippingservice': shippingservice,
          'orders.$.trackingid': trackingid,
        },
      },
      { new: true }
    );

    await OrderDetail.findOneAndUpdate(
      { '_id': _id },
      {
        $set: {
          'status': 'shipped',
          'shippingservice': shippingservice,
          'trackingid': trackingid,
        },
      },
      { new: true }
    );

    console.log("ordershipped")

    res.status(200).json({ message: 'Ordershipped' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};



export const getorders=async (req,res)=>{
  console.log("here")
  const {data}=req.body;
  try{
     
      console.log(data+'is the email in orders')

      OrderDetail.find({ creator: data }, (err, orders) => {
        if (err) {
          console.log(err);
        } else {
          console.log(orders+"is the array of orders");
          res.status(200).json({allorders:orders});
        }
      });


    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}


export const getordersadmin=async (req,res)=>{
  console.log("here")
 
  try{
     
     

       OrderDetail.find({}, (err, orders) => {
        if (err) {
          console.log(err);
        } else {
          console.log(orders+"is the array of orders");
          res.status(200).json({allorders:orders});
        }
      });


    }

    catch(error){
        res.status(404).json({message:error.message});
    }
}

export const getorder=async (req,res)=>{
  console.log("here")
  console.log(req.body)
  const {data}=req.body;

  try{
     
      console.log(data+'is the product id in orders')

      const findProduct= await ProductDetail.findOne({_id:data});
      console.log(findProduct +"is the specific product of that order")
      res.status(200).json(findProduct);

      // OrderDetail.findById(data, async (err, order) => {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log(order +"is the specific order");
      //     const findProduct= await ProductDetail.findOne({_id:order.productid});
      //     console.log(findProduct +"is the specific product of that order")
      //     const toreturn={...order,...findProduct};
      //     console.log(toreturn);

      //     res.status(200).json(toreturn);
      //   }
      // });

      // OrderDetail.find({ creator: data }, (err, orders) => {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log(orders+"is the array of orders");
      //     res.status(200).json({allorders:orders});
      //   }
      // });


    }

    catch(error){
        res.status(404).json({message:error.message});
    }

}


export const shiporderfromseller=async (req,res)=>{

  console.log("here")
  console.log(req.body)
  const order=req.body

  try {


      await Warehouse.findOne({
        "inventory.productid": order.productid,
        email: order.shippingmethod
      })
        .then(warehouse => {
          if (warehouse) {
            // Warehouse found
            console.log("Warehouse has the product and matches shipping method.");
          } else {
            // Warehouse not found
            res.status(200).json({message:"None"});
          }
        })
        .catch(error => {
          console.error("Error occurred while querying the warehouse:", error);
        });

      await Warehouse.updateOne(
                    { email:order.shippingmethod }, 
                    { $push: { orders: order } });
      await OrderDetail.updateOne({ _id: order._id }, order)
                    .then((result) => {
                      console.log("Order updated successfully");
                    })
                    .catch((error) => {
                      console.error("Error updating order:", error);
                    });
      res.status(200).json({message:"Done"});

    
  } catch (error) {
    res.status(404).json({message:error.message});
    
  }

}