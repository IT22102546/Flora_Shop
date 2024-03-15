import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js"
import authRoute from "./routes/auth.route.js"
import productRoute from "./routes/products.route.js"
import cookieParser from "cookie-parser";



dotenv.config();
mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB')
}).catch((err)=>{
    console.log(err)
});

const app = express();
app.use(cookieParser());

app.use(express.json());

app.listen(3000 ,() =>{

    console.log('Server Listning on port 3000')

});

app.use("/api/user",userRoute); 
app.use("/api/auth",authRoute);
app.use("/api/products",productRoute);


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode
    });
})
