import express, { json } from "express";
import User from "./model/User.js";
import connectDB from "./services/db.js";
import { urlencoded } from "express";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import "dotenv/config";
// import multer from "multer";
// import { GridFsStorage } from "multer-gridfs-storage";
// import { GridFSBucket } from "mongodb";
// import mongoose from "mongoose";

// const storage = new GridFsStorage({
//   url: "mongodb+srv://dhirenbk14:helloworld12@cluster23.16jhenq.mongodb.net/blog_db?retryWrites=true&w=majority&appName=Cluster23",
//   file: (req, file) => {
//     return {
//       filename: file.orginalname,
//       bucketName: "uploads",
//     };
//   },
// });
// const upload = multer({ storage: storage });

// let gfs;
// mongoose.connection.once("open", () => {
//   gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//     bucketName: "uploads",
//   });
// });
connectDB().then(() => {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use("/user", userRoute);
  app.use("/auth", authRoute);
  app.use("/", async (req, res) => {
    try {
      const users = await User.aggregate([{ $project: { password: 0 } }]);
      return res.json(users);
    } catch (err) {
      return res.status(500).json({message: "Failed to load user data."})
    }
  });

  app.listen(process.env.PORT, () => {
    console.log(`server stared on PORT => ${process.env.PORT}`);
  });
});
