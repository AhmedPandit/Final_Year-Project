import mongoose from "mongoose";

const DisputeSellers = new mongoose.Schema({
  selleremail: {
    type: String,
    required: true,
  },
  disputeagainst: {
    type: String,
    required: true,
  },
  disputetitle: {
    type: String,
    required: true,
  },
  disputedescription:{
    type:String,
  },
  image:{
    type:String
},
response:{
    type:String,
    default:""
},
status:{
    type:String,
    default:"InProgress"
},

});



export default mongoose.model("disputeseller",DisputeSellers);
