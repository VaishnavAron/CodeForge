const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express=require('express')
const app=express()
app.set('trust proxy', 1);
require('dotenv').config();
const main=require('./config/db')
const CookieParser= require('cookie-parser');
const authRouter=require("./routes/userauth")
const redisClient=require('./config/redis')
const problemRouter=require("./routes/problemCreator")
const submitRouter=require('./routes/submit')

const cors=require('cors')

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json());
app.use(CookieParser());

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);

// Support both /logout and /user/logout for frontend compatibility
const usermiddleware = require('./middleware/usermiddleware');
const { logout } = require('./controllers/userauthenticate');
app.post('/logout', usermiddleware, logout);

const InitalizeConnection=async()=>{
    try{
      if (!redisClient.isOpen) {
        await redisClient.connect().catch(err => console.warn("Redis startup note:", err.message));
      }
      await main();
      console.log("db connected");
    }
    catch(err){
      console.error("Database connection warning:", err.message);
      console.log("Tip: Ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.");
    }

    app.listen(process.env.PORT || 7000, () => {
      console.log("server listening at port number:" + (process.env.PORT || 7000));
    });
}
InitalizeConnection();


// main()
// .then(async ()=>{
//     app.listen(process.env.PORT,()=>{
//     console.log("server listening at port number:"+ process.env.PORT);
// })
// })
// .catch(err=>console.log("Error Occurred:"+err));
