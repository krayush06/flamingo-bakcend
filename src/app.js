require("dotenv").config();
const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database")
const paymentRouter = require("./routes/payment");
const app = express();
//middlewares
app.use(cors({
    origin: [
        "http://localhost:8080",
        "http://localhost:8081",
        "https://flamingo-flutter-zeta.vercel.app",
        "https://flamingo-flutter-e9r6e1vud-krayush06s-projects.vercel.app"
    ],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Import Routers
const authRouter = require("./routes/auth"); // or require("./routes/auth")
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const mongoDb = require("./config/database");

//mount routers
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/", paymentRouter);

const PORT =  process.env.PORT || 7777;

mongoDb()
.then(()=>{
    console.log("Database Connection Established...");
    app.listen(PORT,()=>{
        console.log(`Server is successfully listening on port ${PORT}....`);
    });
})
.catch((err)=>{
    console.error("Database cannot be connected!!!!",err);
});

// request handlers
/*app.use("/test",(req , res) =>{
    res.send("hello from the sever");
});
//listens the server
app.listen(3000 , ()=>{
    console.log("server is working successfully");
});*/