const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");

profileRouter.get("/profile",userAuth,async(req , res)=>{
    try{
    res.send(req.user);
    }catch(err){
    res.status(400).send("Error:" +err.message);
        }
});


// edit Profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const ALLOWED_UPDATES = ["firstName", "lastName", "photoUrl", "gender", "age", "about", "skills"];
    const isUpdateAllowed = Object.keys(req.body).every((key) => ALLOWED_UPDATES.includes(key));

    if (!isUpdateAllowed) {
      throw new Error("Invalid Edit Request!");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({ message: `${loggedInUser.firstName}, your profile was updated successfully`, data: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;