import { connect } from "mongoose";

const connectDB = async () => {
  try {
    await connect(
      "mongodb+srv://dhirenbk14:helloworld12@cluster23.16jhenq.mongodb.net/blog_db?retryWrites=true&w=majority&appName=Cluster23",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connect to Mongodb");
  } catch (err) {
    console.log(err);
  }
};


export default connectDB;