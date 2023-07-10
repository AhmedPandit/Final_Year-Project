import mongoose from "mongoose";
const warehouseSchema=mongoose.Schema({
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
    packagingcharges:{
        type:Number,
        default:2

    },
    shippingcharges:{
        type:Number,
        default:3

    },
    pendingorders:{
        type:Number
    },
    completedorders:{
        type:Number
    },
    accounthealth:{
        type:Number,
        default:100
    },
    image:{
        type:String,
    },
    status:{
        type:String,
    },
    warehousearea:{
        type:String,
        default:0,
    },
    warehousehandletime:{
        type:String,
        default:0,
    },

    accountstanding:{
        type:String,
        default:"activated"
      },
    inventory:[
        {
            productname:String,
            productprice:Number,
            productquantity:Number,
            productcategory:String,
            productdescription:String,
            creator:String,
            image:String,
            shippingmethod:String,
            inventoryspace:Number,
            totalinventoryspace:Number,
            sales:Number,
            views:Number,
            status:String,
            shippingservice:String,
            trackingid:String,
            creationtime:String,
           
        }
    ],
    sellers:[
        {
            name:String,
            email:String,
            phonenumber:String,
            accounthealth:String,
           

        }
    ],
    
    sellersrequest:[
        {
            name:String,
            email:String,
            phonenumber:String,
            accounthealth:String,
            location:String,

        }
    ],



    verifytoken:{
          type:String,
          default:""
    },
    location:{
        type:String,
        required:true
  },
  state:{
    type:String,
    default:"None"
  },
  pendingbalance:{
    type:Number,
    default:0
},
withdrawnbalance:{
    type:Number,
    default:0
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
})

export default mongoose.model("Warehouse",warehouseSchema);
