const express = require("express");
const app = express();
const cors = require("cors");
const userSchema = require("./models/userSchema")
const cookieParser = require('cookie-parser')
const path = require('path')

require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({extended: false}))

// app.get('/', (req, res) => {
//     app.use(express.static(path.resolve(__dirname, "client", "build")));
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// });

app.use('/', require('./routes/authRoute'));

const db = require("./config/database");
db();

app.listen(PORT, () => {
    console.log(`App started on ${PORT}`);
})