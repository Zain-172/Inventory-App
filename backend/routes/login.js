import Login from "../controller/login.js";
import express from "express";

const login_router = express.Router();
const loginInstance = new Login();
login_router.post('/', loginInstance.login);
login_router.post('/reset-password', loginInstance.resetPassword);
login_router.get('/mpin-status/:userId', loginInstance.getMPINStatus);
login_router.post('/set-mpin', loginInstance.setMPIN);
login_router.post('/verify-mpin', loginInstance.verifyMPIN);

export default login_router;