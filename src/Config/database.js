const mongoose = require("mongoose");
const mongoDb = async()=>{
    await mongoose.connect(process.env.MONGO_URI);
};
module.exports = mongoDb;