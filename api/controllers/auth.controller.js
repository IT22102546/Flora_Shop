import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req,res,next)=>{

    const{username,email,password,mobile,adress} = req.body;

    if(!username || !email || !password ||!mobile||!adress|| username === "" || email === "" || password === ""||mobile===""||adress===""){
       next(errorHandler(400,'All fields are required'));
    }

   
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUSer = new User({username,email,password:hashedPassword,adress,mobile});
    try{
        await newUSer.save();
        res.status(201).json({message:"User created successfuly"});

    } catch(err){
      next(err);
    }
   
};

export const signin = async(req,res,next)=>{
  const {email,password} = req.body;
  if(!email || !password || email==="" || password===""){
    next(errorHandler(400,"All fields are required"));
  }
  try{
    const validUser = await User.findOne({email});
    if(!validUser) return next(errorHandler(404,'User not found!'));
    const validPassword = bcryptjs.compareSync(password,validUser.password);
    if(!validPassword) return next(errorHandler(400,'Invalid Credentials!'));
    const token = jwt.sign({id:validUser._id , isAdmin:validUser.isAdmin},process.env.JWT_SECRET);
    const{password:hashedPassword, ...rest} = validUser._doc;
    const expiryDate = new Date(Date.now()+3600000);
    res.cookie('acess_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
  }catch(error){
    next(error);
  }
}

export const google = async (req,res,next) => {
  try{
    const user = await User.findOne({email:req.body.email});
    if (user){
      const token = jwt.sign({id:user._id , isAdmin:user.isAdmin},process.env.JWT_SECRET);
      const{password:hashedPassword, ...rest} = user._doc;
      
      res.cookie('acess_token',token,{httpOnly:true}).status(200).json(rest);
    }else{
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
        const newUser = new User({username:req.body.name.split("").join("").toLowerCase()+Math.random().toString(36).slice(-8), 
        email:req.body.email, password: hashedPassword, profilePicture:req.body.photo });

        await newUser.save();
         const token = jwt.sign({id:newUser._id , isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
         const{password:hashedPassword2, ...rest} = newUser._doc;
         const expiryDate = new Date(Date.now()+3600000);
         res.cookie('acess_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
    }
  }catch(error){
    next(error);
  }
}

