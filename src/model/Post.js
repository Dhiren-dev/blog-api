import { Schema, model } from "mongoose";
import { v4 as uuid4 } from "uuid";

const postSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      default: uuid4,
    },
    title: {
      type: String,
      required: true,
      default: "",
    },
    content: {
      type: String,
      required: true,
      default: "",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Post = model("Post", postSchema);

export default Post;
