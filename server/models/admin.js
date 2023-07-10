import mongoose from "mongoose";
const adminSchema=mongoose.Schema({

    email:{
        type:String,
        required:true
    },
    name:{
        type:String
    },

    password:{
        type:String,
        required:true
    },
})

export default mongoose.model("Admin",adminSchema);
