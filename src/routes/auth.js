const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// signUp Route

authRouter.post("/signup" , async(req,res)=>{
    try{
        const {firstName , lastName , emailId , password } = req.body;
        const passwordHash = await bcrypt.hash(password , 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
    expires: new Date(Date.now() + 8 * 3600000),
    httpOnly: true,
    secure: true,
    sameSite: "none",
});
        res.json({message: "User Added successfully!!",data:savedUser});
    }catch(err){
        res.status(400).send("ERROR:" +err.message);
    }
});

//login Route

authRouter.post("/login",async(req,res)=>{
    try{
    const { emailId , password } = req.body;
    const user = await User.findOne({emailId: emailId.toLowerCase()}).select("+password");
    /*console.log(user);
    console.log("password:",
    user?.password);*/
    if(!user){
        throw new Error("Invalid Credentials!");
    }

    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid){
        const token = await user.getJWT();
        res.cookie("token", token, {
    expires: new Date(Date.now() + 8 * 3600000),
    httpOnly: true,
    secure: true,
    sameSite: "none",
});
        res.send(user);
    }else{
        throw new Error("Invalid Credentials!!");
        }
    }catch(err){
        res.status(400).send("ERROR:"+err.message);
    }
});

// logout Route

authRouter.post("/logout",async(req , res)=>{
    res.cookie("token",null,{expires: new Date(Date.now())});
    res.send("Logout Successful!!");
});

module.exports = authRouter;
