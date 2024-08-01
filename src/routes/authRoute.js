import express from "express";
import auth from "../controller/auth.js";
// import verifyToken from './../util/verifyToken';
const router = express.Router();

router.post("/signup", auth.signUp);
router.post("/login", auth.logIn);
router.post("/forget-password", auth.forgotPassword);
router.post("/reset-password/:token", auth.resetPassword);
router.post("/logout", auth.logOut);

export default router;
