import Login from "../controller/login.js";
import express from "express";

const login_router = express.Router();
const loginInstance = new Login();
login_router.post('/', loginInstance.login);
login_router.post('/reset-password', loginInstance.resetPassword);
login_router.get('/mpin-status/:userId', loginInstance.getMPINStatus);
login_router.post('/set-mpin', loginInstance.setMPIN);
login_router.post('/verify-mpin', loginInstance.verifyMPIN);
login_router.get('/ntn-status/:userId', loginInstance.getNTNStatus);
login_router.post('/set-ntn', loginInstance.setNTN);

export default login_router;