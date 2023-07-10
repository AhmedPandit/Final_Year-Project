import User from "../models/seller.js";
import Chat from "../models/chat.js";

export const getwarehouses=async (req,res)=>{

    const {value}=req.params
    console.log(value);
    try {
        
        const userId = value; // Replace with the actual user ID

        User.findOne({ email: userId })
        .then(user => {
            const warehouses = user.warehouses;
            console.log(warehouses);
            res.status(201).json(warehouses)
        })
        .catch(error => {
            console.error(error);
        });
        
    } catch (error) {
        res.status(409).json({message:error.message});
        
    }
}


export const accessChat=async (req,res)=>{

    const {sellerid,warehouseid}=req.body;

    try {

        var isChat=await Chat.find(
            {
                $and:[
                    {
                        users:{$elemMatch:{$eq:sellerid}}
                    },
                    {
                        users:{$elemMatch:{$eq:warehouseid}}
                    },

                ]
            }
        )


        
    } catch (error) {
        
    }

}