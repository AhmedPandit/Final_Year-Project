import mongoose from "mongoose";

const productdetailsSchema=mongoose.Schema({



    productname:{
        type:String,
        required:true,
        trim:true,
        maxLength:100,
    },
    productprice:{
        type:Number,
        required:true,
    },

    productquantity:{
        type:Number,
        required:true,
    },
    productcategory:{
        type:String,
        required:true,
    },

   productdescription:{
        type:String,
        required:true,
    },

    creator:{
        type:String,
    },

    image:{
        type:String,
        require:true
    },
    shippingmethod:{
        type:String,
        require:true
    },
    sales:{
        type:Number,
    },
    views:{
        type:Number,
       
    },
    inventoryspace:{
        type:Number
    },
    status:{
        type: String
    },
    creationtime:{
        type :String
    },
    totalinventoryspace:{
        type:Number
    }

});

const ProductDetail=mongoose.model("ProductDetail",productdetailsSchema);
export default ProductDetail;