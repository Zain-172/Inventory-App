import express from 'express';
import OTP from '../controller/otp';

const router = express.Router();
const otpInstance = new OTP();

router.post('/generate', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    otpInstance.sendOTPEmail(email);
    res.json({ message: 'OTP sent successfully' });
});

router.post('/validate', (req, res) => {
    const { otp } = req.body;
    if (!otp) {
        return res.status(400).json({ message: 'OTP is required' });
    }
    const validationResult = otpInstance.validateOTP(otp);
    if (validationResult.valid) {
        otpInstance.clearOTP();
        res.json({ message: 'OTP validated successfully' });
    } else {
        res.status(400).json({ message: validationResult.message });
    }
});

export default router;