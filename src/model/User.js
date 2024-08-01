import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "default.jpg",
    },
    createdAt: {
      type: Date,
      default: new Date,
    },
    role: {
      type: String,
      enum: ["user", "admin", "editor", "author"],
      default: "user",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);


userSchema.virtual("passwordReset", {
    token: {
      type: String,
    },
    expires: {
      type: Date,
    },
    updatedAt: {
      type: Date,
      required: true,
    },
    attempt: {
      type: Number
    }
})

const User = model("User", userSchema);

export default User;
