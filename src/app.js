import express, { application, json } from "express";
import path from "path";
import User from "./model/User.js";
import connectDB from "./services/db.js";
import { urlencoded } from "express";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;
const app = express();
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(
  cors({
    origin: "https://blog-dhirendevs-projects.vercel.app",
    credentials: true,  
  })
);
app.use(cookieParser());

connectDB().then(() => {
  app.use(express.static(path.join(__dirname, "../public/uploads")));
  app.use("/user", userRoute);
  app.use("/auth", authRoute);
  app.use("/", async (req, res) => {
    try {
      const users = await User.aggregate([{ $project: { password: 0 } }]);

      const usersWithBase64Images = users.map(user => {
        if (user.profilePicture && user.profilePicture.data) {
          const base64Image = user.profilePicture.data.toString('base64');
          user.profilePicture.data = `data:${user.profilePicture.contentType};base64,${base64Image}`;
        }
        return user;
      });

      return res.status(200).json(usersWithBase64Images);
    } catch (err) {
      return res.status(500).json({ message: "Failed to load user data." });
    }
  });

  app.listen(port, () => {
    console.log(`server stared on PORT => ${process.env.PORT}`);
  });
});
