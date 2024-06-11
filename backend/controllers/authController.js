const User = require('../models/userSchema')
const Token = require('../models/tokenSchema')
const crypto = require("crypto")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
// const {faceDetect} = require('./Faceapi') ;
const faceapi = require('face-api.js');

// test
const test = (req, res) => {
    res.json('test is working')
}

// register user
const register = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        // validation
        if(!name || !email){
            return res.json({
                error: 'Enter name and email'
            })
        }
        if(!password || password.length < 7){
            return res.json({
                error: "Password is required and should be atleast 7 characters long"
            })
        }
        const exist = await User.findOne({email});
        if(exist){
            res.json({
                error: 'Email already registered'
            })
        }

        // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: "Error in hashing"
            })
        }

        const user = await User.create(
            {name, email, password: hashedPassword}
        )

        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save();

        const url = `${process.env.BASE_URL}/user/${user._id}/verify/${token.token}`;

        //send mail
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        let mailOptions = {
            from: process.env.MAIL_USER, // sender address
            to: email, // list of receivers
            subject: "Email Verification", // Subject line
            html: `Click <a href="${url}">${url}</a> here to verify your email` , // html body
        };

        try{
            let info = await transporter.sendMail(mailOptions);
            return res.status(200).json({
                success: true,
                message: "Verification mail sent"
            })
        }catch(err){
            return res.status(500).json({
                error: "Error in sending mail"
            })
        }
        
        
    }catch(err){
        console.log(err);
    }
}

// login
const login = async (req, res) => {
    try{
        const {email, otp} = req.body;
        if(!email || !otp){
            return res.json({
                error: 'Enter all details'
            })
        }
        
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                error: "User doesn't exist"
            })
        }
        if(user.verified === false){
            return res.json({
                error: "Please verify email"
            })
        }

        const match = await bcrypt.compare(otp, user.otp);

        if(match){
            const updatedUser = await User.findOneAndUpdate(
                {email: email},
                {otp: '' },
            );
            return res.json({
                message: "Logged In"
            })
        }
        else{
            return res.json({
                error: "Invalid OTP"
            })
        }
    }catch(err){
        return res.json({
            error: err
        })
    }
}

// send OTP
const sendOTP = async(req, res) => {
    const {email} = req.body;
    try{
        if(!email){
            return res.json({
                error: "Enter email"
            })
        }

        const user = await User.findOne({email});
        if(!user){
            return res.json({
                error: "User doesn't exist"
            })
        }
        if(user.verified === false){
            return res.json({
                error: "Please verify email"
            })
        }

        const OTP = `${Math.floor(1000 + Math.random()*9000)}`;

        //store otp
        let hashedOTP;
        try {
            hashedOTP = await bcrypt.hash(OTP, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }
        
        const updatedUser = await User.findOneAndUpdate(
            {email: email},
            {otp: hashedOTP },
        );
        
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        let mailOptions = {
            from: process.env.MAIL_USER, // sender address
            to: email, // list of receivers
            subject: "OTP Verification", // Subject line
            html: `<p>Enter <b>${OTP}</b> to login.</p>`, // html body
        };

        try{
            let info = await transporter.sendMail(mailOptions);
        }catch(err){
            return res.status(500).json({
                error: "Error in sending mail"
            })
        }     
        
        return res.json({
            success: true,
            message: "OTP sent successfully"
        })
    }catch(err){}
}

// get profile
const getProfile = () => {
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if(err) throw err;
            res.json(user);
        })
    } else{
        res.json(null)
    }
}

const verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id})
        if(!user){
            return res.json({
                error: "Invalid Link"
            })
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        })
        if(!token){
            return res.json({
                error: "Invalid Link"
            })
        }

        await User.updateOne({
            _id: user._id,
            verified: true
        })
        
        // await token.remove();
        const del = await Token.deleteOne({userId: user._id})
        
        return res.json({
            message: "Email verified successfully"
        })
    } catch (err) {
        
    }
}

module.exports = {
    register,
    login,
    getProfile, 
    sendOTP,
    verifyEmail
}