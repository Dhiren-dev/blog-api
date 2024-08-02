import { connect } from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("Connect to Mongo DataBase");
    console.log(process.env.DB_URL)
    console.log(process.env.SECRET)
  } catch (err) {
    console.log(err);
  }
};


export default connectDB;