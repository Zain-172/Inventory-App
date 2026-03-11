import SignUp from "../controller/sign_up.js";
import express from "express";

const sign_up_router = express.Router();

sign_up_router.post("/", (req, res) => {
    const signUpInstance = new SignUp();
    signUpInstance.signUp(req, res);
});

sign_up_router.get("/search-users", (req, res) => {
    const signUpInstance = new SignUp();
    signUpInstance.searchUsers(req, res);
});

export default sign_up_router;