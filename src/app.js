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
    origin: "https://blog-api-q9s2.onrender.com",
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
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ message: "Failed to load user data." });
    }
  });

  app.listen(port, () => {
    console.log(`server stared on PORT => ${process.env.PORT}`);
  });
});
