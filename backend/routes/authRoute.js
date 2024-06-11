const express = require("express");
const router = express.Router();
const cors = require("cors");
const {register, login, getProfile, sendOTP, verifyEmail} = require('../controllers/authController')

// middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
)

// router.get('/', test)
router.post('/signup', register)
router.post('/login', login)
router.post('/otp', sendOTP)
router.get('/profile', getProfile)
router.get('/user/:id/verify/:token', verifyEmail)

module.exports = router;