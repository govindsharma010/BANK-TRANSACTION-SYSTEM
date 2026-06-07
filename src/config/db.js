const mongoose = require("mongoose");

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("server is connected to db");
    }).catch(err =>{
        console.log("error connecting db", err);
        process.exit(1); // stopping server
    })
}

module.exports = connectDB;