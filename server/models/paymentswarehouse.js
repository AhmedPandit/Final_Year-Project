import mongoose from "mongoose";

const Paymentwarehouses = new mongoose.Schema({
  warehouseemail: {
    type: String,
    required: true,
  },
  accountnumber: {
    type: String,
    required: true,
  },
  accounttitle: {
    type: String,
    required: true,
  },
  totalbalance:{
    type:String,
  },
  date:{
    type:String,
  }
});



export default mongoose.model("paymentwarehouse",Paymentwarehouses);
