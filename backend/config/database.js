const mongoose = require("mongoose");
require("dotenv").config();
const mongoDB = process.env.DATABASE_URL;

async function connect(){
    await mongoose.connect(mongoDB);
}

connect()
.then(console.log("DB connected successfully"))
.catch((err) => {
    console.log("DB facing connection error");
    console.log(err);
    process.exit(1); 
});

module.exports = connect;