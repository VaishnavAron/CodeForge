
const jwt=require("jsonwebtoken")
const User=require("../models/user")
const redisClient=require("../config/redis")


const usermiddleware=async(req,res,next)=>{
      try{
        const{token}=req.cookies;
        if(!token)
            throw new Error("token is not present ");
        const payload=jwt.verify(token,process.env.JWT_KEY)
        const{_id}=payload;

        if(!_id)
            throw new Error("Id is missing ");
        const result =await User.findById(_id);

        if(!result){
            throw new Error("User doesn`t exists");
        }
        // Redis blocklist check with graceful fallback
        if (redisClient && redisClient.isOpen) {
          const IsBlocked = await redisClient.exists(`token:${token}`);
          if (IsBlocked) {
            throw new Error("Invalid or revoked token");
          }
        }
        req.result=result;

        next();
      }
      catch(err){
        return res.status(401).json({ message: "Authentication required: " + err.message });
      }
}
module.exports=usermiddleware;