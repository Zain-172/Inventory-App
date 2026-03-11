import express from 'express';
import OTP from '../controller/otp.js';

const otp_router = express.Router();
const otpInstance = new OTP();

otp_router.post('/generate', (req, res) => {
    const { email } = req.body;
    console.log(email);
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    otpInstance.sendOTPEmail(email);
    console.log(otpInstance.otp);
    res.json({ message: 'OTP sent successfully' });
});

otp_router.post('/validate', (req, res) => {
    const { otp } = req.body;
    if (!otp) {
        return res.status(400).json({ message: 'OTP is required' });
    }
    const validationResult = otpInstance.validateOTP(otp);
    if (validationResult.valid) {
        otpInstance.clearOTP();
        res.json({ message: 'OTP validated successfully', valid: true });
    } else {
        res.status(400).json({ message: validationResult.message, valid: false });
    }
});

export default otp_router;