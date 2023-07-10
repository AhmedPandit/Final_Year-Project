import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    buyername: { type: String, default: '' },
    buyeremail: { type: String, default: '' },
    buyershippingaddress: { type: String, default: '' },
    buyerpurchasedata: { type: String, default: '' },
    productid: { type: String, default: '' },
    productname: { type: String, default: '' },
    productprice: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    productquantity: { type: Number, default: 0 },
    productcategory: { type: String, default: '' },
    productdescription: { type: String, default: '' },
    creator: { type: String, default: '' },
    shippingmethod: { type: String, default: '' },
    status: { type: String, default: "pending" },
    shippingservice: { type: String, default: '' },
    trackingid: { type: String, default: '' },
  });

const OrderDetail=mongoose.model("Order",orderSchema);
export default OrderDetail;