import Login from "../controller/login.js";
import express from "express";

const login_router = express.Router();
const loginInstance = new Login();
login_router.post('/', loginInstance.login);

export default login_router;