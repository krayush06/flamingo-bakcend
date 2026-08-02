const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userschema = new mongoose.Schema(
    {
        firstName: {
            type : String,
            required : true,
            minLength : 2,
            maxLength : 50,
            trim : true,
        },
        lastName: {
            type : String,
            trim : true,
        },
        emailId: {
            type:String,
            required: true,
            unique:true,
            lowercase: true,
            trim: true,
            validator(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invaqlid email address:"+value);
                }
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
        age: {
            type : Number,
            min : 18,
        },
        gender : {
            type : String,
            enum :  {
                values : ["Male","Female","others"],
                message : `{value} is not a valid gender type`,
            },
        },
        photoUrl: {
            type : String,
            default : "https://geographyandtopology.ru/wp-content/uploads/2021/01/dummy-avatar.png",
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Invalid Photo URL:"+value);
                }
            },
        },
        about: {
            type: String,
            default: "This is a default about section for the user.",
            maxLenght: 200,
        },
        skills: {
            type: [String],
        },
    },

    { timestamps: true }
);

//helper method  genreate jwt token ke liya likhna hai
// Helper method to validate password during login
userschema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);
  return isPasswordValid;
};

// Helper method to generate JWT token
userschema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

module.exports = mongoose.model("User",userschema);
