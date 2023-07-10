import mongoose from "mongoose";
const chatSchema=mongoose.Schema({
    chatName:{
        type:String,
        trim:true,
        
    },
    users:[{
        type:String,

    }],

}
,{
    timestamps:true,
}
)

export default mongoose.model("Chat",chatSchema);