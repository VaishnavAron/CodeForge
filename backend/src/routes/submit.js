const express=require('express');
const submitRouter=express.Router();
const usermiddleware=require('../middleware/usermiddleware');
const ratelimiter=require('../middleware/ratelimiter');
const {submitCode,runCode}=require('../controllers/userSubmission');

submitRouter.post("/submit/:_id",usermiddleware,ratelimiter,submitCode);
submitRouter.post("/run/:_id",usermiddleware,ratelimiter,runCode);

module.exports=submitRouter;