import user from "../controller/user.js";
// import {
//   addComment,
//   getAuthenticatedUserProfile,
//   updateAuthenticatedUserProfile,
//   getAllPosts,
//   createPost,
//   getPostById,
//   updatePostById,
//   getCommentById,
//   editCommentById,
//   getUserProfileByUsername,
// } from "../controller/user.js";
import express from "express";
import verifyToken from "../util/verifyToken.js";


const router = express.Router();

router.get("/profile", verifyToken, user.getAuthenticatedUserProfile);
router.patch("/profile", verifyToken, user.updateAuthenticatedUserProfile);

router.get("/posts", user.getAllPosts);
router.post("/posts", verifyToken, user.createPost);

router.get("/posts/:id", verifyToken, user.getPostById);
router.put("/posts/:id", verifyToken, user.updatePostById);

router.get("/posts/:id/comments", verifyToken, user.getAllComments);
router.post("/posts/:id/comments", verifyToken, user.addComment);
router.get("/posts/:postId/comments/:commentId  ", verifyToken, user.getCommentById);
router.put("/posts/:postId/comments/:commentId", verifyToken, user.editCommentById);

router.get("/:username", user.getUserProfileByUsername);

export default router;
