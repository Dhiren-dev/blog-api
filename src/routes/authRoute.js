import express from "express";
import auth from "../controller/auth.js";
import multer from "multer";
import verifyToken from "../util/verifyToken.js";
import upload from "../config/storage.js";
import User from "../model/User.js";

const router = express.Router();
router.post("/signup", auth.signUp);

router.post("/upload", verifyToken ,upload.single("avatar"),async (req, res) => {
    console.log(req.file);
    const userId = req.userId;
    if(!userId) { res.status(401).json({message: "Unauthorized"})}
    const user = await User.findOne({ _id: userId });
    user.profilePicture.contentType = req.file.mimetype;
    user.profilePicture.data = req.file.buffer;
    console.log(user);
    await user.save();
    return res.status(200).json({file: req.file , contentType: req.file.mimetype,message: "Profile picture uploaded successfully"} );
})
router.post("/login", auth.logIn);
router.post("/forget-password", auth.forgotPassword);
router.get("/check", auth.check);
router.post("/reset-password/:token", auth.resetPassword);
router.post("/logout", auth.logOut);

export default router;
