import express from "express";
import auth from "../controller/auth.js";
import multer from "multer";
import { storage } from "../util/storage.js";
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/signup", upload.single("avatar"), auth.signUp);
router.post("/login", auth.logIn);
router.post("/forget-password", auth.forgotPassword);
router.post("/check", auth.checkToken);
router.post("/reset-password/:token", auth.resetPassword);
router.post("/logout", auth.logOut);

export default router;
