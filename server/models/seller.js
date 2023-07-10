import mongoose from "mongoose";
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phonenumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    orders:[
        {
            buyername:String,
            buyeremail:String,
            buyershippingaddress:String,
            buyerpurchasedata:String,
            productid:String,
            productname:String,
            productprice:Number,
            productquantity:Number,
            productcategory:String,
            productdescription:String,
            creator:String,
            shippingmethod:String,
            status:String,
            shippingservice:String,
            trackingid:String,
           
        }
    ],
    pendingbalance:{
        type:Number,
        default:0
    },
    withdrawnbalance:{
        type:Number,
        default:0
    },
    accounthealth:{
        type:Number,
        default:100
    },
    image:{
        type:String
    },
    verifytoken:{
          type:String,
          default:""
    },
    location:{
        type:String,
        required:true
  },
  accountstanding:{
    type:String,
    default:"activated"
  },
    warehouses:[
        {
        
            name:String,
            email:String,
            location:String,
            state:String,
            phonenumber:String,
            image:String,
            status:String,
            warehousearea:String,
            warehousehandletime:String,
            packagingcharges:String,
            shippingcharges:String,

            
            
        }
    ],
   
    inventory:[
        {
            productname:String,
            productprice:Number,
            productquantity:Number,
            productcategory:String,
            productdescription:String,
            inventoryspace:Number,
            totalinventoryspace:Number,
            creator:String,
            image:String,
            shippingmethod:String,
            sales:Number,
            views:Number,
            status:String,
            shippingservice:String,
            trackingid:String,
            creationtime:String,
           
        }
    ],

})

export default mongoose.model("Seller",userSchema);
