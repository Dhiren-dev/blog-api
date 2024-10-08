import express, { json } from "express";
import User from "./model/User.js";
import connectDB from "./services/db.js";
import { urlencoded } from "express";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import "dotenv/config";

const port = process.env.PORT || 3000;
const app = express();
app.use(json());
app.use(urlencoded({ extended: false }));

connectDB().then(() => {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
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

  app.listen(port, () => {
    console.log(`server stared on PORT => ${process.env.PORT}`);
  });
});
