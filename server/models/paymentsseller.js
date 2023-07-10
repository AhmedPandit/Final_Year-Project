import mongoose from "mongoose";

const Paymentsellers = new mongoose.Schema({
  selleremail: {
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



export default mongoose.model("paymentseller",Paymentsellers);
