const jwt=require("jsonwebtoken")
const User=require("../models/user")
const redisClient=require("../config/redis")


const adminmiddleware=async(req,res,next)=>{
      try{
        let token = req.cookies?.token;
        if (!token && req.headers.authorization) {
          const parts = req.headers.authorization.split(' ');
          if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
          }
        }
        if(!token)
            throw new Error("token is not present ");
        const payload=jwt.verify(token,process.env.JWT_KEY)
        const{_id}=payload;

        if(!_id)
            throw new Error("Id is missing ");
        const result =await User.findById(_id);

        if(payload.role!='admin')
            throw new Error("Invalid Token")

        if(!result){
            throw new Error("User doesn`t exists");
        }
        //redis ke blocklist mein present toh nahi hai 

        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            return res.status(401).json({ message: "Session expired or token revoked" });
        }

        req.result = result;
        next();
      }
      catch(err){
        return res.status(403).json({ message: "Forbidden: Admin privileges required. " + err.message });
      }
}
module.exports=adminmiddleware;