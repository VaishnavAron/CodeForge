const User=require("../models/user")
const validate=require('../utils/validator');
const bcrypt= require("bcrypt")
const jwt=require("jsonwebtoken")
const redisClient=require('../config/redis')
const  submission=require('../models/submission');


const register=async(req,res)=>{
try{
    //validate the data
    validate(req.body);
    
 const {firstName,emailId,password}=req.body;

 req.body.password=await bcrypt.hash(password,10);
 req.body.role='user'

 const user=await User.create(req.body);

 const token=jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:60*60});
 const reply={
        firstName:user.firstName,
        emailId:user.emailId,
        Id:user.Id
    }
 const cookieOptions = {
   maxAge: 7 * 24 * 60 * 60 * 1000,
   httpOnly: true,
   sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
   secure: process.env.NODE_ENV === 'production'
 };

 res.cookie('token', token, cookieOptions);
 res.status(201).json({
    user: reply,
    message: "Registered and logged in successfully"
 });
}
catch(err){
    console.log("REGISTER ERROR:", err);
  res.status(400).json({
  message: err.message
});
}
}

const login=async(req,res)=>{ 
    try{
        const {emailId,password}=req.body;

        if(!emailId)
            throw new Error("Invalid credential");
        if(!password)
            throw new Error ("Invalid credential");
       const user= await User.findOne({emailId});
       if(!user)
        throw new Error("Invalid Credentials");
    const match=await bcrypt.compare(password,user.password);

    if(!match)
        throw new Error("Invalid Credentials");

    const reply={
        firstName:user.firstName,
        emailId:user.emailId,
        role:user.role,
        _id:user._id
    }
    
    const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
    const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production'
    };
    res.cookie('token', token, cookieOptions);
    res.status(200).json({
        user: reply,
        message: "logged In successfully"
    });
    }
    catch(err){
       res.status(401).json({ message: err.message || "Authentication failed" });
    }
}

const logout=async(req,res)=>{
    try{
        const { token } = req.cookies;
        if (token) {
            const payload = jwt.decode(token);
            if (payload && payload.exp) {
                await redisClient.set(`token:${token}`, "Blocked");
                await redisClient.expireAt(`token:${token}`, payload.exp);
            }
        }
        res.cookie("token", "", {
            expires: new Date(0),
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        });
        res.status(200).json({ message: "logged out successfully" });
    }
    catch(err){
        res.status(500).json({ message: err.message || "Logout failed" });
    }
}

const adminregister=async(req,res)=>{
    //if admin wants to register he has to mention the role :admin otherwise by default admin register will register the user only so admin register has both the power he can register user as well as admin (the very first admin can be made by modifying the database manually)
    try{
    //validate the data
    validate(req.body);
    
 const {firstName,emailId,password}=req.body;

 req.body.password=await bcrypt.hash(password,10);
 

 const user=await User.create(req.body);

 const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
 res.cookie('token',token,{maxage:60*60*100});
 res.status(201).send("admin Registered successfully");
}
catch(err){
   res.status(400).send("Error:"+err);
}
}

const deleteProfile= async(req, res)=>{
    try{
      const userId=req.result.id;
      // userSchema delete
      await User.findByIdAndDelete(userId);
      // await submission.deleteMany({userId});
       res.status(200).send("deleted Successfully");
    }
   catch(err){
   res.status(500).send('Internal Server Error'+err);
   }
}


module.exports={register,login,logout,adminregister,deleteProfile};