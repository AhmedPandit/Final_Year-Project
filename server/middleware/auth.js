import jwt from "jsonwebtoken";

const auth=async(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(" ")[1];
        const isCustomAuth= token.lenght<500;
        let decodeData;

        if(token && isCustomAuth){
                decodeData=jwt.verify(token,'test');
                req.userId= decodeData?.id;
                
        }
        next();

    } catch (error) {
        
    }
}

export default auth;